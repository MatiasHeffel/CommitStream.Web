(function() {
  var commitsGet = require('../helpers/commitsGet'),
    cacheCreate = require('../helpers/cacheCreate'),
    childCommitsGet = require('../helpers/childCommitsGet'),
    _ = require('underscore');

  var cache = cacheCreate();

  module.exports = function(req, res) {
    var workitems = req.params.workitems;
    var instanceId = req.instance.instanceId;

    var buildUri = function(page) {
      return req.href('/api/' + instanceId + '/commits/tags/versionone/workitems/' + workitems + '?page=' + page + '&apiKey=' + req.instance.apiKey);
    };

    // TODO: refactor when we support ad-hoc queries on multiple workitems...
    var workitemsArray = workitems.split(',');

    if (workitemsArray.length === 1) {
      var stream = 'versionOne_CommitsWithWorkitems-' + instanceId + '_' + workitems;

      commitsGet(req.query, stream, buildUri, cache).then(function(commits) {
        // TODO use hal?
        res.send(commits);
      });
    } else {
      var streams = [];
      _.each(workitemsArray, function(e, i) {
        streams.push('versionOne_CommitsWithWorkitems-' + instanceId + '_' + e);
      });
      childCommitsGet(req.query, streams, buildUri).then(function(commits) {
        res.send(commits);
      });
    }
  };
}());