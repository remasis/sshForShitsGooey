var mongoose = require('mongoose'),
  Attempt = mongoose.model('Attempt');

/**
 * List of Attempts
 */
exports.all = function(req, res) {
  Attempt.find({})
    .sort('-ts')
    .exec(function(err, attempts) {
      if (err) {
        res.json(500, err);
      } else {
        res.json(attempts);
      }
    });
};
