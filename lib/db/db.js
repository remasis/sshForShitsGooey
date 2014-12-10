'use strict';

var mongoose = require('mongoose'); // mongoose for mongodb
var dbcreds = require('./dbcreds.json');

var connectString = 'mongodb://' + dbcreds.username + ':' + dbcreds.password + '@ds063140.mongolab.com:63140/sshforshits';

var mongoOptions = {
	db: {
		safe: true
	},
	server: {
		auto_reconnect: true
	}
};

// Connect to Database
mongoose.connect(connectString, mongoOptions, function(err, res) {
	if (err) {
		console.log('ERROR connecting to: database. ' + err);
	} else {
		console.log('Successfully connected to database.');
	}
});

mongoose.connection.on('error', function(err) {
	console.log("** DB ERROR: ", err);
});

exports.db = mongoose.connection.db;