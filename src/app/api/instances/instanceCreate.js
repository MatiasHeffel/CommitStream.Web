(function() {
  var instanceFormatAsHal = require('./instanceFormatAsHal'),
    setTimeout = require('../helpers/setTimeout'),
    config = require('../../config'),
    uuid = require('uuid-v4'),
    mongoose = require('mongoose'),
    Instance = require('../../models/instance');

  module.exports = function(req, res, next) {
    var instance = new Instance();
    instance.instanceId = uuid();
    instance.apiKey = uuid();

    instance.save(function(err, instance) {
      // TODO: find a general way of handling errors like we used to have with
      // the event store helper
      if (err) return res.send(500, err);

      var hypermedia = instanceFormatAsHal(req.href, instance);
      setTimeout(function() {
        res.hal(hypermedia, 201);
      }, config.controllerResponseDelay);
    });

  };
}());
