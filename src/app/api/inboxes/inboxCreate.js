(function() {
  var inboxAdded = require('./inboxAdded'),
    inboxFormatAsHal = require('./inboxFormatAsHal'),
    //sanitizeAndValidate = require('../sanitizeAndValidate'),    
    config = require('../../config'),
    mongoose = require('mongoose'),
    uuid = require('uuid-v4'),
    Inbox = require('../../models/inbox');

  module.exports = function(req, res) {
    // TODO: validate with mongoose schema
    //sanitizeAndValidate('inbox', req.body, ['family', 'name', 'url'], inboxAdded);
    var inbox = new Inbox();
    inbox.instanceId = req.instance.instanceId;
    inbox.digestId = req.digest.digestId;
    inbox.inboxId = uuid();
    inbox.name = req.body.name;
    inbox.family = req.body.family;
    inbox.url = req.body.url;

    //req.body.digestId = digestId;
    // TODO: find a general way of handling errors like we used to have with
    // the event store helper
    inbox.save(function(err, i) {
      if (err) return res.send(500, err);
      var hypermedia = inboxFormatAsHal(req.href, i.instanceId, i);
      res.hal(hypermedia, 201);
    });
  };
}());
