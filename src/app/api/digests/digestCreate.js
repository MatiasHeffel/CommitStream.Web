(function() {
  var digestAdded = require('./digestAdded'),
    digestFormatAsHal = require('./digestFormatAsHal'),
    sanitizeAndValidate = require('../sanitizeAndValidate'),
    setTimeout = require('../helpers/setTimeout'),
    config = require('../../config'),
    mongoose = require('mongoose'),
    uuid = require('uuid-v4'),
    Digest = require('../../models/digest');

  module.exports = function(req, res, next) {
    //TODO: use mongoose validation
    //sanitizeAndValidate('digest', req.body, ['description'], digestAdded);
    var digest = new Digest();
    digest.instanceId = req.instance.instanceId;
    digest.digestId = uuid();
    digest.description = req.body.description;

    digest.save(function(err, d) {
      // TODO: find a general way of handling errors like we used to have with
      // the event store helper
      if (err) return res.send(500, err);

      var hypermedia = digestFormatAsHal(req.href, d.instanceId, d);
      setTimeout(function() {
        res.hal(hypermedia, 201);
      }, config.controllerResponseDelay);
    });
  };
}());
