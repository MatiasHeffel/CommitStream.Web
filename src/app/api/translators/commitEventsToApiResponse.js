//TODO: convert to ES6
(function() {
  var _ = require('underscore'),
    moment = require('moment');

  module.exports = function(entries) {
    var commits = _.map(entries, function(entry) {
      var e = JSON.parse(entry.data);

      return {
        commitDate: e.commit.committer.date,
        timeFormatted: moment(e.commit.committer.date).fromNow(),
        author: e.commit.committer.name,
        sha1Partial: e.sha.substring(0, 6),
        family: e.family,
        action: "committed",
        message: e.commit.message,
        commitHref: e.html_url,
        repo: e.repo,
        branch: e.branch,
        branchHref: e.branchHref,
        repoHref: e.repoHref
      };
    });
    var response = {
      commits: commits
    };
    return response;
  };
})();