(function() {
  var csError = require('./csError'),
    mongoose = require('mongoose'),
    Digest = require('../models/digest');

  var InvalidInstanceToDigest = csError.createCustomError('InvalidInstanceToDigest', function(instanceId, digestId) {
    var message = 'The digest ' + digestId + ' does not exist for instance ' + instanceId;
    var errors = [message];
    InvalidInstanceToDigest.prototype.constructor.call(this, errors, 404);
  });

  module.exports = function(req, res, next, digestId) {
    Digest.findOne({
      digestId: digestId
    }, function(err, digest) {
      if (!digest) throw new InvalidInstanceToDigest(req.instance.instanceId, digestId);
      
      if (req.instance.instanceId === digest.instanceId) {
        req.digest = digest;
        next();
      } else {
        throw new InvalidInstanceToDigest(req.instance.instanceId, digestId);
      }
    });
  };
}());
