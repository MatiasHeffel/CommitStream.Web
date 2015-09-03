(function() {
  var csError = require('./csError'),
    mongoose = require('mongoose'),
    Inbox = require('../models/inbox');

  var InvalidInstanceToInbox = csError.createCustomError('InvalidInstanceToInbox', function(instanceId, inboxId) {
    var message = 'The inbox ' + inboxId + ' does not exist for instance ' + instanceId;
    var errors = [message];
    InvalidInstanceToInbox.prototype.constructor.call(this, errors, 404);
  });

  var InstanceToInboxRemoved = csError.createCustomError('InstanceToInboxRemoved', function(instanceId, inboxId) {
    var message = 'The inbox ' + inboxId + ' has been removed from instance ' + instanceId + '.';
    var errors = [message];
    InstanceToInboxRemoved.prototype.constructor.call(this, errors, 410);
  });

  module.exports = function(req, res, next, inboxId) {
    Inbox.findOne({
      inboxId: inboxId
    }, function(err, i) {
      if (err) return res.status(500).send(err);
      if (!i) throw new InvalidInstanceToDigest(req.instance.instanceId, digestId);
      // TODO: do we still want this?
      // if (inbox.eventType === 'InboxRemoved') {
      //   throw new InstanceToInboxRemoved(req.instance.instanceId, inboxId);
      // }
      if (req.instance.instanceId === i.instanceId) {
        req.inbox = i;
        next();
      } else {
        throw new InvalidInstanceToInbox(req.instance.instanceId, inboxId);
      }
    });
  };
}());
