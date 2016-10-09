var read = require('./read')
var save = require('./save')
var uri = "http://weibo.com/kankanews?profile_ftype=1&is_all=1#_0"
var site = "http://weibo.com/rmrb";
var wUrl = 'http://weibo.cn/kankanews'
var async = require('async')
var debug = require('debug')('crawl:main')

var kNews = [];
var kComments = [];

async.series([
    function (done) {
        read.readNews(wUrl,function(err,list){
            kNews = list
            done(err)
        })
    }
],function(err,result){
    if(err)
        console.log(err)
    else
        console.log('所有任务都完成了')
        debug('所有的任务完成了');
})




