
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
//var user = require('./routes/user');
var http = require('http');
var path = require('path');

var MongoStore = require('connect-mongo')(express);
var settings = require('./settings');
var flash = require('connect-flash');


var config = require('./config').config;

var app = express();

// all environments
app.set('port', process.env.PORT || config.port);
app.set('views', path.join(__dirname, 'views'));


//app.set('view engine', 'ejs');
var hbs = require('hbs');
//hbs.registerPartial('partial', fs.readFileSync(__dirname + '/views/partial.hbs', 'utf8'));
hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'html');
app.engine('html', require('hbs').__express);
//局部视图


app.use(flash());

app.use(express.favicon());
app.use(express.logger('dev'));

//app.use(express.json());
//app.use(express.urlencoded());
app.use(express.bodyParser());



app.use(express.methodOverride());

app.use(express.cookieParser());
app.use(express.session({
    secret: settings.cookieSecret,
    key: settings.db,//cookie name
    cookie: {maxAge: 1000 * 60 * 60 * 24 * 30},//30 days
    store: new MongoStore({
        db: settings.db
    })
}));

//不是很满意的话？？？？？
//app.use(function(req,res,next){
//    console.log('now now now')
//    console.log('user'+req.session.user.name);
//
//    res.locals.user=req.session.user;
//    var err = req.flash('error');
//    res.locals.error = err.length ? err : null;
//    res.locals.success=req.flash('success').length?req.flash('success'):null;
//    next();
//});

app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

//app.get('/', routes.index);
//app.get('/users', user.list);


routes(app);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
