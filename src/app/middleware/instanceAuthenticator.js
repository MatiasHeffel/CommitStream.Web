(function() {
  var csError = require('./csError'),
    mongoose = require('mongoose'),
    Instance = require('../models/instance');

  var InvalidInstanceApiKey = csError.createCustomError('InvalidInstanceApiKey', function(instanceId) {
    var message = 'Invalid apiKey for instance ' + instanceId;
    var errors = [message];
    InvalidInstanceApiKey.prototype.constructor.call(this, errors, 401);
  });

  module.exports = function(req, res, next, instanceId) {
    Instance.findOne({
      instanceId: instanceId
    }, function(err, instance) {
      if (!instance) throw new InvalidInstanceApiKey(instanceId);

      if (instance.apiKey === req.query.apiKey ||
        instance.apiKey === req.get('Bearer')) {
        req.instance = instance;
        next();
      } else {
        throw new InvalidInstanceApiKey(instanceId);
      }
    });
  };
}());
