(function() {
  var validateUUID = require('../validateUUID'),
    translatorFactory = require('../translators/translatorFactory'),
    commitsAddedFormatAsHal = require('./commitsAddedFormatAsHal'),
    MalformedPushEventError = require('../../middleware/malformedPushEventError'),
    mongoose = require('mongoose'),
    Commit = require('../../models/commit');

  module.exports = function(req, res) {
    var instanceId = req.instance.instanceId,
      digestId = req.inbox.digestId,
      inboxId = req.params.inboxId;

    validateUUID('inbox', inboxId);

    var translator = translatorFactory.create(req);

    if (!translator) {
      throw new MalformedPushEventError();
    }

    var events = translator.translatePush(req.body, instanceId, digestId, inboxId);
    //TODO: what to do if just one fails the validation? stop there or continue
    // with the next?
    //TODO: validation does not seem to work for bulk insertion
    Commit.collection.insert(events, function(err, commits) {
      if (err) return res.send(500, err);

      var inboxData = {
        inboxId: inboxId,
        digestId: digestId
      };

      var hypermedia = commitsAddedFormatAsHal(req.href, instanceId, inboxData);
      res.hal(hypermedia, 201);
    });
  };
}());
