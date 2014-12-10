// server.js

// set up ========================
var express = require('express');
var app = express(); // create our app w/ express
var morgan = require('morgan'); // log requests to the console (express4)
var bodyParser = require('body-parser'); // pull information from HTML POST (express4)
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)

var fs = require('fs'),
    path = require('path');

// configuration =================

require('./lib/db/db.js');
// Bootstrap mongodb models (dynamically)
var modelsPath = path.join(__dirname, 'lib/models');
fs.readdirSync(modelsPath).forEach(function(file) {
    require(modelsPath + '/' + file);
});



app.use(express.static(__dirname + '/dist'));
app.use(morgan('dev')); // log every request to the console
app.use(bodyParser.urlencoded({
    'extended': 'true'
})); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json

app.use(methodOverride());

//bootstrap routes
require('./lib/routes/routes')(app);

// listen (start app with node server.js) ======================================
app.listen(9999);
console.log("App listening on port 9999");