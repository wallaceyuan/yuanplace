var mysql = require('mysql');
var debug = require('debug')('crawl:save');
var pool = mysql.createPool({
    host:'127.0.0.1',
    user:'root',
    password:'admin',
    database:'yuan_place',
});
var async = require('async');
//把分类列表存入数据库
exports.kNews = function(list,callback){
    async.forEach(list,function(item,cb){
        debug('保存新闻',JSON.stringify(item));
        pool.query('replace into c_weibo(mid,text,cLink) values(?,?,?)',[item.mid,item.text,item.cLink],function(err,result){
            cb();
        });
    },callback);
}

//把文章列表存入数据库
exports.kComment = function(list,callback){
    async.forEach(list,function(item,cb){
        debug('保存文章',JSON.stringify(item));
        pool.query('replace into p_weibo(cid,mid,userName,content) values(?,?,?,?)',[item.cid,item.mid,item.userName,item.content],function(err,result){
            cb();
        });
    },callback);
}
