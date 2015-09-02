(function() {
  var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

  var digestSchema = new mongoose.Schema({
    instanceId: String,
    digestId: String,
    description: String
  });

  module.exports = mongoose.model('Digest', digestSchema);
}());
