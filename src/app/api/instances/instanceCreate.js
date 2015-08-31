(function() {
  var instanceFormatAsHal = require('./instanceFormatAsHal'),
    setTimeout = require('../helpers/setTimeout'),
    config = require('../../config'),
    mongoose = require('mongoose'),
    model = require('../../models/instance'),
    Instance = mongoose.model('Instance'),
    uuid = require('uuid-v4');

  module.exports = function(req, res, next) {
    var instance = new Instance();
    instance.instanceId = uuid();
    instance.apiKey = uuid();

    instance.save(function(err, instance) {
      if (err) return res.send(500, err);

      var hypermedia = instanceFormatAsHal(req.href, instance);
      setTimeout(function() {
        res.hal(hypermedia, 201);
      }, config.controllerResponseDelay);
    });

  };
}())
