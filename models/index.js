//mongoose ---connect mongodb
var Mongoose = require('mongoose');
var config = require('../config').config;

var db_url = process.env.MONGOHQ_URL || config.db;
var db = Mongoose.connect(db_url, function (err) {
    if (err) {
        console.error('connect to %s error: ', config.db, err.message);
        process.exit(1);
    }
});

// models
require('./kind');
require('./task');
require('./user');


exports.Kind = Mongoose.model('Kind');
exports.Task = Mongoose.model('Task');
exports.User = Mongoose.model('User');
