var crypto = require('crypto');
var User = require('../proxy').User;
var Q = require('q');
exports.reg  =  function (req, res) {
    var method = req.method.toLowerCase();
    if(method == 'get'){
        res.render('reg', {
            title: '注册',
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        });
    }
    if (method == 'post'){

        var name = req.body.name,
            password = req.body.password,
            password_re = req.body['password-repeat'];
        if (password_re != password) {
            req.flash('error', '两次输入的密码不一致!');
            return res.redirect('/reg');
        }


        var md5 = crypto.createHash('md5'),
            password = md5.update(req.body.password).digest('hex');
        var newUser = new User({
            name: req.body.name,
            password: password,
            email: req.body.email
        });

        User.getOneByName(newUser.name)
        .then(function(hasUser){
            if(hasUser){
                req.flash('error', '用户已存在!');
                return res.redirect('/reg');
            }

            newUser.save().then(function(user){
                req.session.user = user;
                req.flash('success', '注册成功!');
                res.redirect('/');
            },function (error){
                if (error) {
                    req.flash('error', err);
                    return res.redirect('/reg');
                }
            });

        });

    }
}


exports.login  =  function (req, res) {
    var method = req.method.toLowerCase();
    console.log(method);
    if(method == 'get'){
        res.locals = {
            title: '登录'
        }
        res.render('login');
    }

    if(method == 'post'){
        var md5 = crypto.createHash('md5'),
            password = md5.update(req.body.password).digest('hex');
        User.getOneByName(req.body.name)
            .then(function (user){
                if (!user) {
                    req.flash('error', '用户不存在!');
                    return res.redirect('/login');
                }
                if (user.password != password) {
                    req.flash('error', '密码错误!');
                    return res.redirect('/login');
                }

                req.session.user = user;
                req.flash('success', '登陆成功!');
                res.redirect('/');
            },function(error){
                if (error){
                    req.flash('error', err);
                    return res.redirect('/');
                }
            })

    }

}

exports.logout = function (req, res) {
    console.log('logout ctrl');
    var method = req.method.toLowerCase();
    if(method == 'get'){
        req.session.user = null;
        req.flash('success', '登出成功!');
        res.redirect('/');
    }
}

exports.list =  function(req, res){

    var u_page = req.query.u_p ? parseInt(req.query.u_p) : 1;

    Q.all([
        User.getCountByUid(null),
        User.getTenByUid(null, u_page)
    ]).spread(function(u_total, users){
            res.render('user/users-list', {
                title: 'home',
                users_info : users,
                u_page: u_page,
                u_total: u_total,
                user: req.session.user,
                isUFirstPage: (u_page - 1) == 0,
                isULastPage: ((u_page - 1) * 10 + users.length) == u_total,
                success: req.flash('success').toString(),
                error: req.flash('error').toString()
            });
        });

}

exports.info = function (req, res) {
    User.getOneByUid(req.params.uid)
    .then(function(user){
        if (!user) {
            req.flash('error', '用户不存在!');
            return res.redirect('/users');//????????????????????????????????????????????
        }
            if(user._id == req.session.user._id){
                req.session.user.isUserMy = true;
            }else{
                req.session.user.isUserMy = false;
            }


        res.render('user/user-info', {
            title: '用户信息',
            user: req.session.user,
            user_info: user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        });
    });
}

exports.edit = function (req,res){
    var method = req.method.toLowerCase();
    if(method == 'get'){
        User.getOneByUid(req.params.uid)
            .then(function(user){

                if (!user) {
                    req.flash('error', '用户不存在!');
                    return res.redirect('/users-list');//????????????????????????????????????????????
                }

                if(user._id != req.session.user._id ){
                    req.flash('error', '不是本人，不可修改');
                    return res.redirect('/users-list');
                }

                res.render('user/user-edit', {
                    title: '用户信息修改',
                    user: req.session.user,
                    user_info: user,
                    success: req.flash('success').toString(),
                    error: req.flash('error').toString()
                });
            });

    }
    if( method == 'post'){

        User.updateInfoByUid(req.params.uid, req.body.email)
            .then(function(){
                console.log('this');

                url = '/user/info/'+ req.params.uid;
                req.flash('success', '用户信息修改成功!');
                res.redirect(url);

        },function (err){
                url = '/user/info/'+ req.params.uid;
                if (err){
                    req.flash('error', err);
                    return res.redirect(url);
                }
            });

    }

}

exports.passwordModify = function (req,res){
    var method = req.method.toLowerCase();
    if(method == 'get'){

        res.render('user/user-password', {
            title: '用户密码修改',
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        });
    }

    if(method == 'post'){
        User.getOneByUid(req.params.uid)
        .then(function(user){
                console.log('user'+user);
                url = '/user/info/'+ req.params.uid;


                console.log(user.password);

                var md5 = crypto.createHash('md5'),
                    password_old = md5.update(req.body['password-old']).digest('hex'),
                    password_new = req.body['password-new'],
                    password_re = req.body['password-repeat'];

                //console.log(password_new);


                if(password_old!= user.password ){
                    req.flash('error', "原密码不正确");
                    return res.redirect(url);
                }



                if (password_re != password_new) {
                    req.flash('error', '两次输入的密码不一致!');
                    return res.redirect(url);
                }

                console.log('password: ' +password_new);

                var md5 = crypto.createHash('md5'),
                    password_new = md5.update(password_new).digest('hex');

                console.log(password_new == password_old);
                console.log('ps new'+password_new);
                return password_new;
            }).then(function(password){
                console.log('---------------');
                console.log('password'+password)
                User.updatePasswordByUid(req.params.uid, password)
                .then(function(){
                        url = '/user/info/'+ req.params.uid;
                        req.flash('success', '用户密码修改成功!');
                        res.redirect(url);
                    })
            }).catch(function(err){
                console.log('now err');
                if (err){
                    req.flash('error', err);
                    return res.redirect(url);
                }
            });

    }






}