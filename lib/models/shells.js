'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var ShellSchema = new Schema({
  src: String,
  dst: String,
  user: String,
  pass: String,
  login: Date,
  logout: Date,
  shellactivity: [{
    ts: Date,
    cmd: String,
    resp: String
  }]
}, {
  collection: 'pwns'
});


/**
 * Define model.
 */

mongoose.model('Shell', ShellSchema);