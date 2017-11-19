/**
 * Created by yuanyuan on 2017/11/19.
 */
var read = require('./read')
var save = require('./save')
var uri = "http://weibo.com/kankanews"
var async = require('async')
var debug = require('debug')('crawl:main')
var conf = require('../config/conf')
var pool = conf.pool
var kNews = []

pool.getConnection(function(err, connection) {
    async.waterfall([
        function (done) {
            read.kNewscom(uri,function(err,list){
                kNews = list
                done(err,kNews)
            })
        },
        function (res,done) {
            save.crawler({"connection":connection,"res":kNews},done)
        },
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