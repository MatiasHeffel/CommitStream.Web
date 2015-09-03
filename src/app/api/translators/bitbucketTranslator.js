'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _underscore = require('underscore');

var _underscore2 = _interopRequireDefault(_underscore);

var _uuidV4 = require('uuid-v4');

var _uuidV42 = _interopRequireDefault(_uuidV4);

var _middlewareBitbucketCommitMalformedError = require('../../middleware/bitbucketCommitMalformedError');

var _middlewareBitbucketCommitMalformedError2 = _interopRequireDefault(_middlewareBitbucketCommitMalformedError);

var _v1Mentions = require('./v1Mentions');

var _v1Mentions2 = _interopRequireDefault(_v1Mentions);

var bitbucketTranslator = {};

var hasCorrectHeaders = function hasCorrectHeaders(headers) {
  return headers.hasOwnProperty('x-event-key') && headers['x-event-key'] === 'repo:push';
};

bitbucketTranslator.canTranslate = function (request) {
  return hasCorrectHeaders(request.headers);
};

// https://serverUrl/repoOwner/repoName
var getRepoHref = function getRepoHref(repoInfo) {
  return repoInfo.serverUrl + '/' + repoInfo.repoOwner + '/' + repoInfo.repoName;
};

// http://serverUrl/repoOwner/reponame/tree/branchName
var getBranchHref = function getBranchHref(repoHref, branch) {
  return repoHref + '/tree/' + branch;
};

var getRepoInfo = function getRepoInfo(commitUrl) {

  var repoArray = undefined;

  repoArray = commitUrl.split('/commits')[0].split('/');

  r = {};
  r.repoName = repoArray.pop();
  r.repoOwner = repoArray.pop();
  r.serverUrl = repoArray.pop();

  if (repoArray.pop() === '') {
    r.serverUrl = repoArray.pop() + '//' + r.serverUrl;
  }

  return r;
};

bitbucketTranslator.translatePush = function (pushEvent, instanceId, digestId, inboxId) {
  try {
    var _ret = (function () {
      var latestCommit = pushEvent.push.changes[0]['new'];
      //TODO: we only have the date of the newest commit in the push.
      //Do we want to use it for every commit?
      var branch = latestCommit.name;
      var date = latestCommit.target.date;
      var repository = {
        id: pushEvent.repository.uuid,
        name: pushEvent.repository.name
      };
      // Bitbucket puts the newest commits firts hence the reverse
      var commits = pushEvent.push.changes[0].commits.reverse();
      var events = _underscore2['default'].map(commits, function (aCommit) {
        var commit = {
          instanceId: instanceId,
          digestId: digestId,
          inboxId: inboxId,
          eventType: 'BitbucketCommitReceived',
          sha: aCommit.hash,
          commit: {
            author: aCommit.author.user.username,
            // bitbucket does not have a commit.committer object. Using the same thing as author for now.
            committer: {
              name: aCommit.author.user.display_name,
              email: aCommit.author.raw,
              date: date
            },
            message: aCommit.message
          },
          html_url: aCommit.links.html.href,
          repository: repository,
          branch: branch,
          mentions: _v1Mentions2['default'].getWorkitems(aCommit.message),
          family: 'Bitbucket',
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
    throw new _middlewareBitbucketCommitMalformedError2['default'](ex, pushEvent);
  }
};

exports['default'] = bitbucketTranslator;
module.exports = exports['default'];
