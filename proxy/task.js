var Mongoose = require("mongoose"), Schema = Mongoose.Schema;
var Q = require('q');

var Task = require('../models').Task;
var Kind = require('../proxy').Kind;
var User = require('../proxy').User;

function TaskDao(user,title,stat, kinds, content) {
    this.user = user;
    this.title = title;
    this.stat = stat;
    this.kinds = kinds;
    this.content = content;
};

TaskDao.prototype.save = function(){
    var date = new Date();

    //存储各种时间格式，方便以后扩展
    var time = {
        date: date,
        year: date.getFullYear(),
        month: date.getFullYear() +'-' + (date.getMonth() + 1),
        day: date.getFullYear() + '-' +(date.getMonth() + 1) + '-' + date.getDate(),
        minute: date.getFullYear() + '-' + (date.getMonth() + 1) +'-' + date.getDate() + " "+ date.getHours() + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes() )
    }
    task = {
        user: this.user,
        title: this.title,
        stat: this.stat,
        kinds: this.kinds,
        content: this.content,
        time: time
    }

    newTask = new Task(task);
    var deferred = Q.defer();
    //console.log('here taskdao ww')
    newTask.save(function(err,task){
        if(err){
            deferred.reject(err);
        } else {
            task.kinds.map(function(kid){
                Kind.updateByIdOneTask(kid, task._id);
            });
            deferred.resolve(task);
        }
    })

    return deferred.promise;
}

TaskDao.getTenTasksByUid = function(uid, page){
    var query = {};
    if (uid){
        query.user = uid;
    }
    var deferred = Q.defer();
    var findFunc = function(query){
          return Task.find(query)
            .populate('kinds')
            .limit(10)
            .skip((page - 1) * 10)
            .sort('-_id').exec(function (err, tasks){
                  tasks.forEach(function(task){
                      if(task.stat == 'done'){
                          task.stat = '已做';
                      }else{
                          task.stat = '未做';
                      }

                  })
                  return tasks;
              });
    }
    Q.all([
        Task.count(query).exec(),
        findFunc(query)
    ]).spread(function(total, tasks){
            console.log('here');
            deferred.resolve([total, tasks]);
        });
    return deferred.promise;
}


TaskDao.getTenTasks= function(page){
    var query = {};

    var deferred = Q.defer();
    var findFunc = function(query){
        return Task.find(query,{
            user:1,
            title:1,
            kinds:1,
            time:1
        }).populate('kinds')
            .populate('user')
            .limit(10)
            .skip((page - 1) * 10)
            .sort('-_id')
            .exec(function (err, tasks){
                tasks.forEach(function(task){

                    if(task.stat == 'done'){
                        task.stat = '已做';
                    }else{
                        task.stat = '未做';
                    }

                })
                return tasks;
            });
    }
    Q.all([
            Task.count(query).exec(),
            findFunc(query)
        ]).spread(function(total, tasks){
            console.log('here');
            deferred.resolve([total, tasks]);
        });
    return deferred.promise;
}


TaskDao.getOneById = function(tid){
    var deferred = Q.defer();
    console.log('proxy getTaskById')
    Task.findById(tid)
        .populate('user')
        .populate('kinds')
        .exec(function (err, task){
            if(err) deferred.reject(err);
//            if(task.stat == 'done'){
//                console.log('stat '+task.stat);
//                task.stat = '已做';
//            }else{
//                task.stat = '未做';
//            };
            deferred.resolve(task);

        });
    return deferred.promise;




}


TaskDao.editByTid = function(tid,user,title,stat, kinds, content){

    console.log('kinds==list- req ==' + kinds + '  type ==' + typeof kinds);
    var deferred = Q.defer();

//    Kind.getKindsByQuery({}, {},function(err,kinds_get){
//        if(err){
//            deferred.reject(err);
//        }
//        kinds_get.forEach(function(kind_get){
//            kind_get.tasks.pull(tid); //删除tid
//            if (typeof kinds =='string' && kind_get._id == kinds) {
//                    kind_get.tasks.push(tid);
//            } else {
//                for (var i=0;i<kinds.length;i++) {
//                    if (kind_get._id == kinds[i]) {
//                        kind_get.tasks.push(tid);
//                        break;
//                    }
//                }
//            }
//            kind_get.save();//保存
//        })
//    })// 结束 对Kinds中tasks的保存
    console.log('kind.length '+ kinds.length);
    Kind.kindRemoveTasks(tid).then(function() {
        if (typeof kinds  == "string") {
            Kind.updateByIdOneTask(kinds, tid);
        }else if(kinds.length !='undefined'){
            kinds.forEach(function(kid){
                Kind.updateByIdOneTask(kid, tid);
            });
        }
        console.log('update end');
    });

    var editTask = {
        "user":user,
        "title":title,
        "stat": stat,
        "kinds": kinds,
        "content":content
    }


    Task.findByIdAndUpdate(tid, {$set: editTask}).exec(function(err){

            if(err){
                deferred.reject(err);
            }else{
                deferred.resolve(null);
            }
        })
    return deferred.promise;




};


module.exports = TaskDao;