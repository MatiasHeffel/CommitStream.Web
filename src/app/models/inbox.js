(function() {
  var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

  var inboxSchema = new mongoose.Schema({
    instanceId: String,
    digestId: String,
    inboxId: String,
    name: String,
    family: String,
    url: String
  });

  module.exports = mongoose.model('Inbox', inboxSchema);
}());
