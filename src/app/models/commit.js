(function() {
  var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

  var commitSchema = new mongoose.Schema({
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
    mentions: [],
    sha: {
      type: String,
      required: true
    },
    html_url: {
      type: String,
      required: true
    },
    repository: {
      type: String,
      required: true
    },
    branch: {
      type: String,
      required: true
    },
    originalMessage: {
      type: Schema.Types.Mixed,
      required: true
    },
    commit: {
      author: {
        type: String,
        required: true
      },
      committer: {
        name: {
          type: String,
          required: true
        },
        email: {
          type: String,
          required: true
        },
        date: {
          type: String,
          required: true
        }
      },
      message: {
        type: String,
        required: true
      }
    }
  });

  module.exports = mongoose.model('Commit', commitSchema);
}());
