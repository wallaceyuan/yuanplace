var read = require('./read')
var save = require('./save')
var uri = "http://weibo.com/kankanews?profile_ftype=1&is_all=1#_0"
var wUrl = 'http://weibo.cn/kankanews'
var async = require('async')
var debug = require('debug')('crawl:main')
var kNews = []
var kComment = []

async.waterfall([
    function (done) {
        read.kNews(wUrl,function(err,list){
            kNews = list
            done(err,kNews)
        })
    },
    function (res,done) {
        save.kNews(res,done)
    },
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
        async.forEach(kNews,function(kn,next){
            read.kComment(kn,function (err,list) {
                kComment = kComment.concat(list)
                next();
            })
        },done)
    },function (done) {
        save.kComment(kComment,done)
    }
],function(err,res){
    if(err)
        console.log(err)
    else
        console.log('所有任务都完成了')
        debug('所有的任务完成了');
})