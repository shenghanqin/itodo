var Mongoose = require("mongoose"), Schema = Mongoose.Schema;
var Q = require('q');


var Kind = require('../models').Kind;
var User = require('./user');


function KindDao(name, point) {
    this.name = name;
    this.point = point;
};

KindDao.prototype.save = function(){
    var kind = {
        name: this.name,
        point: this.point
    }
    newKind = new Kind(kind);
    deferred = Q.defer();



     newKind.save(function(err){
         console.log('newKind save ');
         if(err){
             deferred.reject(err);
         }else {
             deferred.resolve(null);
         }
     });
    return deferred.promise;
};



KindDao.getAll = function(){
    var deferred = Q.defer();
    Kind.find({}).exec(function(err,kinds){
        if (err){
            deferred.reject(err);
        }else {
            deferred.resolve(kinds);
        }
    })
    return deferred.promise;
};

KindDao.updateByIdOneTask = function(kid,tid){
    var deferred = Q.defer();
    console.log('kid---'+kid);
    console.log('tid---'+tid);
    Kind.findByIdAndUpdate(kid, {"$push": {"tasks": tid}},function(err){
        if (err){
            deferred.reject(err);
        }else{
            deferred.resolve(null);
        }
    })
    return deferred.promise;

}

KindDao.getOneByID = function(kid){
    var deferred = Q.defer();
    Kind.findById(kid,function(err, kind){
        if (err){
            deferred.reject(err);
        }else{
            deferred.resolve(kind);
        }
    })
    return deferred.promise;
}

KindDao.getOneByIDCall = function(kid, callback){
    Kind.findOne(kid, callback);
}

KindDao.getKindsByIds = function(kids, callback){
    Kind.find({'_id': {'$in': kids}}, callback);
}

KindDao.kindRemoveTasks = function(tid){
    var  deferred = Q.defer();
    KindDao.getKindsByQuery({tasks:{$all: tid}}, {},function(err,kinds_get){
        if(err){
            deferred.reject(err);
        }else{
            kinds_get.forEach(function(kind_get){
                kind_get.tasks.pull(tid); //删除tid
                kind_get.save();//保存
            })
            deferred.resolve(null);
        }
    })// 结束 对Kinds中tasks的保存
    return deferred.promise;

}

KindDao.getKindsByQuery = function(query, opt, callback){
    Kind.find(query,{}, opt, callback);
}








module.exports = KindDao;