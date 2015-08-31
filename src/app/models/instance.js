var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var instanceSchema = new mongoose.Schema({
  instanceId: String,
  apiKey: String
});

mongoose.model('Instance', instanceSchema);
