var read = require('./read')
var save = require('./save')
var _ = require('lodash')
var uri = "http://weibo.com/kankanews"
var wUrl = 'http://weibo.cn/kankanews'
var async = require('async')
var debug = require('debug')('crawl:main')
var conf = require('../config/conf')
var pool = conf.pool
var kNews = []
var kComment = []

pool.getConnection(function(err, connection) {
    async.waterfall([
        function (done) {
            read.kNews(wUrl,function(err,list){
                kNews = list
                done(err,kNews)
            })
        },
        function (res,done) {
            read.kNewscom(uri,function(err,list){
                kNews = list
                res.map(function(obj,i){
                    var ex = new Object()
                    ex.cid = obj.mid,ex.clink = obj.cLink
                    _.assignIn(kNews[i],ex);
                })
                done(err,kNews)
            })
        },
        function (res,done) {
            console.log('save save')
            kNews = res.filter(function (i) {
                return i.cid
            })
            save.kNewscom({"connection":connection,"res":kNews},done)
        },
        function (done) {
            console.log('start read comment')
            async.forEach(kNews,function(kn,next){
                read.kComment(kn,function (err,list) {
                    kComment = kComment.concat(list)
                    next();
                })
            },done)
        },function (done) {
            console.log('start save comment',kComment)
            save.kComment({"connection":connection,"res":kComment},done)
            //save.kCommentCom({"connection":connection,"res":kComment},done)
        }
    ],function(err,res){
        if(err)
            console.log(err)
        else{
            console.log('所有任务都完成了')
            connection.release()
        }
        debug('所有的任务完成了');
    })
})
