var read = require('./read')
var save = require('./save')
var Request = require('request');
var weiboLoginModule = require("./weiboLogin");
var uri = "http://weibo.com/kankanews"
var async = require('async')
var debug = require('debug')('crawl:main')
var util = require('../libs/util')


var conf = require('../config/conf')
var pool = conf.pool

var kNews = []
var kComment = []
var cookie

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
            console.log('start read comment')
            if(cookie){
                console.log('有cookie')
                async.forEach(kNews,function(kn,next){
                    read.kCommentCom({"kn":kn,"request":request},function (err,list) {
                        kComment = kComment.concat(list)
                        next();
                    })
                },done)
            }else{
                console.log('无cookie')
                weiboLoginModule.login('1272864289@qq.com','wallace7411302',function(err,cookieColl){
                    if(!err){
                        cookie = cookieColl
                        console.log(cookie)
                        util.writeFileAsync('./cookie.json',JSON.stringify(cookieColl))
                        var request = Request.defaults({jar: cookie});
                        async.forEach(kNews,function(kn,next){
                            read.kCommentCom({"kn":kn,"request":request},function (err,list) {
                                kComment = kComment.concat(list)
                                next();
                            })
                        },done)
                    }else{
                        console.log(err)
                    }
                })
            }
/*            var cookie = util.readFileAsync('./cookie.json','utf-8').then((data)=>{
                console.log('cookie',data)
                console.log(typeof(JSON.parse(data)) )
                var request = Request.defaults({jar: JSON.parse(data)});

            })*/

        },function (done) {
            console.log('start save comment')
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






