(function() {
  var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

  var inboxSchema = new mongoose.Schema({
    instanceId: {
      type: String,
      required: true
    },
    digestId: {
      type: String,
      required: true
    },
    inboxId: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    family: {
      type: String,
      required: true
    },
    url: String
  });

  module.exports = mongoose.model('Inbox', inboxSchema);
}());
