var Task = require('../proxy').Task;
var Kind = require('../proxy').Kind;
var User = require('../proxy').User;

exports.index = function (req, res) {
    var t_page = req.query.t_p ? parseInt(req.query.t_p) : 1;
    Task.getTenTasks(t_page)
        .spread(function(t_total, tasks_info){
            res.locals = {
                title: '首页',
                tasks_info: tasks_info,
                t_page: t_page,
                t_total: t_total,
                isTFirstPage: (t_page - 1) == 0,
                isTLastPage: ((t_page - 1) * 10 + tasks_info.length) == t_total,
                user: req.session.user,
                success: req.flash('success').toString(),
                error: req.flash('error').toString()

            };
            res.render('index');
        })
};