'use strict';

(function (gitLabTranslator) {
  var _ = require('underscore'),
      uuid = require('uuid-v4'),
      GitLabCommitMalformedError = require('../../middleware/gitLabCommitMalformedError'),
      v1Mentions = require('./v1Mentions');

  var hasCorrectHeaders = function hasCorrectHeaders(headers) {
    return headers.hasOwnProperty('x-gitlab-event') && headers['x-gitlab-event'] === 'Push Hook';
  };

  gitLabTranslator.canTranslate = function (request) {
    // gitLab does not have a pusheEvent.repository.id field, and github does
    // gitLab does not have a commit.committer object, and github does
    if (hasCorrectHeaders(request.headers)) {
      return true;
    }
    return false;
  };

  var getRepoInfo = function getRepoInfo(commitUrl) {
    var repoArray = undefined;
    repoArray = commitUrl.split('/commit')[0].split('/');
    var r = {};
    r.repoName = repoArray.pop();
    r.repoOwner = repoArray.pop();
    r.serverUrl = repoArray.pop();

    if (repoArray.pop() === '') {
      r.serverUrl = repoArray.pop() + '//' + r.serverUrl;
    }

    return r;
  };

  // http://serverUrl/repoOwner/reponame/tree/branchName
  var getBranchHref = function getBranchHref(repoHref, branch) {
    return repoHref + '/tree/' + branch;
  };

  // https://serverUrl/repoOwner/repoName
  var getRepoHref = function getRepoHref(repoInfo) {
    return repoInfo.serverUrl + '/' + repoInfo.repoOwner + '/' + repoInfo.repoName;
  };

  gitLabTranslator.translatePush = function (pushEvent, instanceId, digestId, inboxId) {
    try {
      var _ret = (function () {
        var branch = pushEvent.ref.split('/').pop();
        var repository = {
          // gitLab does not have a repository id
          // id: pushEvent.repository.id,
          name: pushEvent.repository.name
        };

        var events = _.map(pushEvent.commits, function (aCommit) {
          var commit = {
            instanceId: instanceId,
            digestId: digestId,
            inboxId: inboxId,
            eventType: 'GitLabCommitReceived',
            sha: aCommit.id,
            commit: {
              author: aCommit.author,
              // gitLab does not have a commit.committer object. Using the same thing as author for now.
              // committer: {
              //   name: aCommit.committer.name,
              //   email: aCommit.committer.email,
              //   date: aCommit.timestamp
              // },
              committer: {
                name: aCommit.author.name,
                email: aCommit.author.email,
                date: aCommit.timestamp
              },
              message: aCommit.message
            },
            html_url: aCommit.url,
            repository: repository,
            branch: branch,
            mentions: v1Mentions.getWorkitems(aCommit.message),
            family: 'GitLab',
            originalMessage: aCommit
          };
          var repoInfo = getRepoInfo(commit.html_url);
          commit.repoHref = getRepoHref(repoInfo);
          commit.repo = repoInfo.repoOwner + '/' + repoInfo.repoName;
          commit.branchHref = getBranchHref(commit.repoHref, branch);
          return commit;
        });

        return {
          v: events
        };
      })();

      if (typeof _ret === 'object') return _ret.v;
    } catch (ex) {
      throw new GitLabCommitMalformedError(ex, pushEvent);
    }
  };
})(module.exports);
