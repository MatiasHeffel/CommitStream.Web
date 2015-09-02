(function() {
  var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

  var instanceSchema = new mongoose.Schema({
    instanceId: {
      type: String,
      required: true
    },
    apiKey: {
      type: String,
      required: true
    }
  });

  module.exports = mongoose.model('Instance', instanceSchema);
}());
