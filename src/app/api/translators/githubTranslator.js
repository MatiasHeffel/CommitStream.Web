(function(githubTranslator) {
  var _ = require('underscore'),
    util = require('util'),
    uuid = require('uuid-v4'),
    createCustomError = require('custom-error-generator'),
    csError = require('../../middleware/csError'),
    v1Mentions = require('./v1Mentions');

  //TODO: do we want this kind of library to know about status codes?
  githubTranslator.GitHubCommitMalformedError = createCustomError('GitHubCommitMalformedError', null, function(error, pushEvent) {
    this.statusCode = 400;
    this.originalError = error;
    this.errors = [error.toString()];
    this.pushEvent = pushEvent;
  });

  var getRepoInfo = function(commitUrl) {
    var repoArray;
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

  var getBranchHref = function(repoHref, branch) {
    // http://serverUrl/repoOwner/reponame/tree/branchName
    return repoHref + '/tree/' + branch;
  }

  var getRepoHref = function(repoInfo) {
    // https://serverUrl/repoOwner/repoName
    return repoInfo.serverUrl + '/' + repoInfo.repoOwner + '/' + repoInfo.repoName;
  }

  githubTranslator.translatePush = function(pushEvent, instanceId, digestId, inboxId) {
    try {
      var branch = pushEvent.ref.split('/').pop();
      var repository = {
        id: pushEvent.repository.id,
        name: pushEvent.repository.name
      };

      var events = _.map(pushEvent.commits, function(aCommit) {

        var commit = {
          instanceId: instanceId,
          digestId: digestId,
          inboxId: inboxId,
          eventType: 'GitHubCommitReceived',
          sha: aCommit.id,
          commit: {
            author: aCommit.author,
            committer: {
              name: aCommit.committer.name,
              email: aCommit.committer.email,
              date: aCommit.timestamp
            },
            message: aCommit.message
          },
          html_url: aCommit.url,
          repository: repository,
          branch: branch,
          mentions: v1Mentions.getWorkitems(aCommit.message),
          family: 'GitHub',
          originalMessage: aCommit
        };

        var repoInfo = getRepoInfo(commit.html_url);
        commit.repoHref = getRepoHref(repoInfo);
        commit.repo = repoInfo.repoOwner + '/' + repoInfo.repoName;
        commit.branchHref = getBranchHref(commit.repoHref, branch);

        return commit;
      });

      return events;
    } catch (ex) {
      var otherEx = new githubTranslator.GitHubCommitMalformedError(ex, pushEvent);
      //console.log(otherEx, otherEx.originalError.stack);
      throw otherEx;
    }
  };

  githubTranslator.canTranslate = function(request) {
    var headers = request.headers;
    if (headers.hasOwnProperty('x-github-event') && headers['x-github-event'] === 'push') {
      return true;
    }
    return false;
  };

})(module.exports);