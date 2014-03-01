var Kind = require('../proxy').Kind;
exports.list = function (req, res) {
    Kind.getAll().then(function(kinds_info){
        res.render('kind/kinds-list', {
            title: '类型列表',
            kinds_info: kinds_info,
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        });

    },function(err){
        if(err){
            res.render('kind/kinds-list', {
                title: '类型列表',
                user: req.err<n.user,
                success: req.flash('success').toString(),
                error: req.flash('error').toString()
            });
        }
    })

};

exports.new = function(req, res){
    var method = req.method.toLowerCase();
    if (method == 'get'){
        res.render('kind/kind-new', {
            title: '新增类型',
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        });
    }
    if (method == 'post'){
        var newKind =new Kind(req.body.name, req.body.point);
        newKind.save().then(function(){
            req.flash('success', '新增成功!');
            res.redirect('/kinds-list');
        },function(err){
            req.flash('err', err);
            res.redirect('/kinds-list');
        })


    }

};