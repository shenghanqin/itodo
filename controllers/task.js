//var kindDao = require('../dao/kindDao');
var Task = require('../proxy').Task;
var Kind = require('../proxy').Kind;
var User = require('../proxy').User;
var Q = require('q');
exports.new =  function (req, res) {
    var method = req.method.toLowerCase();
console.log('new_______________________________');
    if(method == 'get'){
        Kind.getAll().then(function(kinds_info){
            console.log('abc'+kinds_info);
            if(!kinds_info){
                kinds_info = [];
            }
            res.render('task/task-new', {
                title: '写新任务',
                kinds_info: kinds_info,
                user: req.session.user,
                success: req.flash('success').toString(),
                error: req.flash('error').toString()
            });
        },function(err){
            console.log(err);
        });
    }

    if (method == 'post'){
        console.log('stat'+req.body.stat);

        console.log('req.body.kinds'+req.body.kinds);


        //console.log(req.body.kinds.length);
        var currentUserID = req.session.user._id,
            title = req.body.title,
            stat = req.body.stat,
            kinds =typeof req.body.kinds != 'undefined'? req.body.kinds.valueOf(): [] ,
            content = req.body.content;



            //增加新任务 //在类型中输入任务的id
        var newTask = new Task(currentUserID, title, stat, kinds, content);
        var url = 'tasks/'+req.session.user._id+'/list';

        newTask.save().then(function(task){
            console.log(task);

            console.log(task);
            console.log('kinds   '+kinds);
            req.flash('success', '任务添加成功!');
            res.redirect(url);
        },function(err){
            req.flash('error', err);
            res.redirect(url);
        })

    }

}

exports.oneUserList = function(req, res){
    var t_page = req.query.t_p ? parseInt(req.query.t_p) : 1;

    Q.all([
        User.getOneByUid(req.params.uid),
        Task.getTenTasksByUid(req.params.uid, t_page)
    ]).spread(function(user_info,total_and_tasks){
            var t_total = total_and_tasks[0],
                tasks_info = total_and_tasks[1];
           console.log('task_info--'+tasks_info);
            res.render('task/tasks-uid-list', {
                title: '某某人的任务',
                tasks_info: tasks_info,
                user_info: user_info,
                t_page: t_page,
                t_total: t_total,
                user: req.session.user,
                isTFirstPage: (t_page - 1) == 0,
                isTLastPage: ((t_page - 1) * 10 + tasks_info.length) == t_total,
                success: req.flash('success').toString(),
                error: req.flash('error').toString()
            });
        });


}

exports.oneTask = function(req, res){
    console.log('oneTask  '+ req.params.tid);

    Task.getOneById(req.params.tid)
        .then(function(task_info){
            console.log('2------------------------------');
            if(task_info.stat.toString() == "1"){
                console.log('stat yes'+typeof task_info.stat);
                task_info.stat_cn = '已做';
            }else{
                console.log('stat no'+typeof task_info.stat);
                task_info.stat_cn = '未做';
            };
            console.log('stat '+task_info.stat_cn);
        res.render('task/task-one', {
            title: '任务-'+task_info.title,
            task_info: task_info,
            user: req.session.user,
            userIsMy: User.getIfUserMy(req.session.user._id, task_info.user._id),
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        });
    })
}

exports.oneTaskEdit = function(req, res){
    //console.log('oneTask  '+ req.params.tid);
    var method = req.method.toLowerCase();
    if(method == 'get'){
        Task.getOneById(req.params.tid)
            .then(function(task_info){
                Kind.getAll().then(function(kinds){
                    var kinds = kinds;
                    for (var i = 0; i < kinds.length; i++) {

                        for (var j = 0; j < kinds[i].tasks.length; j++) {
                            if(kinds[i].tasks[j].toString() == task_info._id.toString()){
                                kinds[i].isSelect = true;
                                break;
                            }else{
                                kinds[i].isSelect = false;
                            } //end if
                        } //end for

                    }//end for

                    //console.log('------------'+kinds[0].isSelect);
                    Task.getOneById(req.params.tid)
                        .then(function(task_info){
                            console.log('2------------------------------')
                            res.render('task/task-edit', {
                                title: '任务-'+task_info.title,
                                kinds_info:kinds,
                                task_info: task_info,
                                user: req.session.user,
                                success: req.flash('success').toString(),
                                error: req.flash('error').toString()
                            });
                        });

                });


            });
    }//end if

    if(method == 'post'){
        var url = '/task/one/'+ req.body.tid;

        console.log('req.body.kinds '+ req.body.kinds);

        var tid = req.body.tid,
            currentUserID = req.body.user,
            title = req.body.title,
            stat = req.body.stat,

            kinds =typeof req.body.kinds != 'undefined'? req.body.kinds.valueOf(): [] ,
            content = req.body.content;
        console.log('kinds==end=='+kinds);
        Task.editByTid(tid,currentUserID,title,stat,kinds,content).then(function(){
            res.redirect(url);
        });

    }






}

