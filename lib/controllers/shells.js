var mongoose = require('mongoose'),
  Shell = mongoose.model('Shell');

/**
 * List of Shells
 */
exports.all = function(req, res) {
  Shell.find({})
    .select('login src dst user')
    .sort('-login')
    .exec(function(err, shells) {
      if (err) {
        res.json(500, err);
      } else {
        res.json(shells);
      }
    });
};

/**
 * Find shell by id
 */
exports.shell = function(req, res, next, id) {
  Shell.findOne({
    _id: id
  }, function(err, shell) {
    if (err) {
      return next(err);
    }
    if (!shell) {
      return next(new Error('Failed to load shell ' + id));
    }
    req.shell = shell;
    next();
  });
};

exports.getRecent = function(req,res){
  Shell.find({})
    .sort('-login')
    .limit(1)
    .exec(function(err, shells) {
      if (err) {
        res.json(500, err);
      } else {
        res.json(shells);
      }
    });
};

/**
 * Show a shell
 */
exports.show = function(req, res) {
  res.json(req.shell);
};