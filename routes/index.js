var crypto = require('crypto');
var Q = require('q');

//controller
var user = require('../controllers/user');
var site = require('../controllers/site');
var kind = require('../controllers/kind');
var task = require('../controllers/task');


module.exports = function(app) {

//不是很满意的话？？？？？


    app.get('/', site.index);


//reg
    app.get('/reg',checkNotLogin, user.reg);
    app.post('/reg', checkNotLogin, user.reg);
//login
    app.get('/login', checkNotLogin,user.login);
    app.post('/login', checkNotLogin, user.login);
//logout
    app.get('/logout', checkLogin, user.logout);

//userList
    app.get('/users-list', checkLogin, user.list);

//user info
    app.get('/user/info/:uid', checkLogin,user.info);

//user edit
    app.get('/user/edit/:uid', checkLogin, user.edit);
    app.post('/user/edit/:uid', checkLogin,user.edit);
//user password modify
    app.get('/user/password/:uid', checkLogin, user.passwordModify);
    app.post('/user/password/:uid', checkLogin, user.passwordModify);
//kind
    app.get('/kinds-list', checkLogin, kind.list);
//kind new
    app.get('/kind/new', checkLogin, kind.new);
    app.post('/kind/new', checkLogin, kind.new);
//task new
    app.get('/task/:uid/new', checkLogin, task.new);
    app.post('/task/:uid/new', checkLogin, task.new);
//one user tasks list
    app.get('/tasks/:uid/list', checkLogin, task.oneUserList);
//one task
    app.get('/task/one/:tid', checkLogin, task.oneTask);
//one task edit
    app.get('/task/edit/:tid', checkLogin, task.oneTaskEdit);
    app.post('/task/edit/:tid', checkLogin, task.oneTaskEdit);
//one task stat modify
   // app.get('/task/one/:tid/stat/:sno',checkLogin, task.oneStat);


    app.use(function (req, res) {
        res.render("404");
    });

    function checkLogin(req, res, next) {
        //console.log('cl');
        if (!req.session.user) {
            req.flash('error', '未登录!');
            res.redirect('/login');
        }
        console.log('cl2');
        next();
    }

    function checkNotLogin(req, res, next) {
console.log('checkNotLogin')
        if (req.session.user) {
            req.flash('error', '已登录!');
            console.log(req.session.user);
            return res.redirect('back');
        }
        next();
    }
}