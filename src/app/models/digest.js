(function() {
  var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

  var digestSchema = new mongoose.Schema({
    instanceId: {
      type: String,
      required: true
    },
    digestId: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    }
  });

  module.exports = mongoose.model('Digest', digestSchema);
}());
