var path = require('path');
var pkg = require('./package.json');
var envport = process.env.PORT || 3000;

//var dbURL = 'mongodb://'+process.env.JAE_MONGO_USERNAME+':'+process.env.JAE_MONGO_PASSWORD+'@'+db_host+':'+process.env.JAE_MONGO_PORT+'/'+process.env.JAE_MONGO_DBNAME;
var dbURL = 'mongodb://127.0.0.1/itodo';


var config = {
    db: dbURL,
    //port:3000
    port: envport
};


module.exports = config;
module.exports.config = config;