module.exports = function(app) {
  'use strict';
  
  //----------------
  // Shell Routes
  //----------------
  var shells = require('../controllers/shells');
  app.get('/api/shells', shells.all);
  app.get('/api/shells/recent', shells.getRecent);

  //Setting up the shellId param
  app.param('shellId', shells.shell);
  app.get('/api/shells/:shellId', shells.show);

  var attempts = require('../controllers/attempts.js');
  app.get('/api/attempts', attempts.all);
};