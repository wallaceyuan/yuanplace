var read = require('./read')
var save = require('./save')
var Request = require('request');
var weiboLoginModule = require("./weiboLogin");
var uri = "http://weibo.com/kankanews"
var async = require('async')
var debug = require('debug')('crawl:main')

var conf = require('../config/conf')
var pool = conf.pool

var kNews = []
var kComment = []

pool.getConnection(function(err, connection) {
    async.waterfall([
        function (done) {
            read.kNewscom(uri,function(err,list){
                kNews = list
                done(err,kNews)
            })
        },
        function (res,done) {
            save.kNewscom({"connection":connection,"res":res},done)
        },
        function (done) {
            weiboLoginModule.login('1272864289@qq.com','wallace7411302',function(err,cookieColl){
                if(!err){
                    var request = Request.defaults({jar: cookieColl});
                    async.forEach(kNews,function(kn,next){
                        read.kCommentCom({"kn":kn,"request":request},function (err,list) {
                            kComment = kComment.concat(list)
                            next();
                        })
                    },done)
                }
            })
        },function (done) {
            save.kCommentCom({"connection":connection,"res":kComment},done)
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






