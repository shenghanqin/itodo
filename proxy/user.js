var crypto = require('crypto');
var Mongoose = require("mongoose"), Schema = Mongoose.Schema;
var Q = require('q');


var User = require('../models').User;



function UserDao(user) {
    this.name = user.name;
    this.password = user.password;
    this.email = user.email;
};


UserDao.prototype.save = function() {
    var md5 = crypto.createHash('md5'),
        email_MD5 = md5.update(this.email.toLowerCase()).digest('hex'),
        head = "http://www.gravatar.com/avatar/" + email_MD5 + "?s=48";
    var user = {
        name: this.name,
        password: this.password,
        email: this.email,
        head: head
    };


    var deferred = Q.defer();
    var newUser = new User(user);

    console.log('save name --' + user.name);

    newUser.save(function (err, user){
        console.log('model save')
        if (err){
            console.log(err);
            deferred.reject(err)
        }else{
            deferred.resolve(user);
        }
    })

    return deferred.promise;

};

UserDao.getOneByName = function(name) {

    var deferred = Q.defer();


    User.findOne({name: name}, function (err, user) {
        if (err) {
            deferred.reject(err);
        }else{
            deferred.resolve(user);
        }
    });

    return deferred.promise;
};

UserDao.getCountByUid = function(uid){
    var deferred = Q.defer();
    var query = {};
    if(uid){
        query._uid = uid;
    }
    console.log('get count')
    User.count(query,function(err, total){
        if (err){
            deferred.reject(err);
        }else{
            deferred.resolve(total);
        }
    })
    return deferred.promise;
}

UserDao.getTenByUid= function (uid, page){
    var deferred = Q.defer();
    var query = {};
    if(uid){
        query._uid = uid;
    }

    User.find(query, {}, {sort: [{'_id': -1}],  skip: (page - 1) * 10, limit: 10},function (err,users){
        if (err){
            console.log('get users err+' +err);
            deferred.reject(err);
        }else{
            deferred.resolve(users);
        }
    });



    return deferred.promise;




//    User.count(query, function (err, total){
//        console.log("total------"+total);
//
//        User.find(query, {}, {sort: [{'_id': -1}],  skip: (page - 1) * 10, limit: 10}, function (err, users){
//            if(err){
//                return callback(err);
//            }
//            return callback(null, users, total)
//        });
//    });

};

UserDao.getOneByUid = function(uid) {
    var deferred = Q.defer();

    User.findById(uid, function(err, user){
        if (err){
            deferred.reject(err);
        }else{
            deferred.resolve(user)
        }
    })

    return deferred.promise;
};
UserDao.updateInfoByUid = function(uid, email) {
    var deferred = Q.defer();
    User.findByIdAndUpdate(uid,{"$set": {"email": email}})
        .exec(function(err){
            if (err) {
                deferred.reject(err);
            }else{
                deferred.resolve()
            }
        });
    return deferred.promise;


};

UserDao.updatePasswordByUid = function(uid, password) {
    var deferred = Q.defer();
    console.log(password+ 'biz');
    User.findByIdAndUpdate(uid,{"$set": {"password": password}})
    .exec(function(err){
            if(err){
                deferred.reject(err);
            }else{
                deferred.resolve(null);
            }
        });
    return deferred.promise;
};

UserDao.getIfUserMy = function(sessionUserId, thatUserId){

    if (sessionUserId == thatUserId) {
        return true;
    } else {
        return false;
    }
};
module.exports = UserDao;