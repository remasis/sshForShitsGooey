'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var AttemptSchema = new Schema({
  origin: String,
  user: String,
  pass: String,
  ts: Date
}, {
  collection: 'attempts'
});


/**
 * Define model.
 */

mongoose.model('Attempt', AttemptSchema);