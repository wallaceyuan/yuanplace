var mysql = require('mysql');
var debug = require('debug')('crawl:save');
var conf = require('../config/conf')
var pool = conf.pool

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

exports.kNewscom = function(list,callback){
    console.log('保存新闻')
    var connection = list.connection
    async.forEach(list.res,function(item,cb){
        debug('保存新闻',JSON.stringify(item));
        var data = [item.tbinfo,item.mid,item.isforward,item.minfo,item.omid,item.text,item.sendAt]
        if(item.forward){
            var fo = item.forward
            data = data.concat([fo.name,fo.id,fo.text,fo.sendAt])
        }else{
            data = data.concat(['','','',new Date()])
        }

        connection.query('select * from kweibo where mid = ?',[item.mid],function (err,res) {
            if(err){
                console.log(err)
            }
            if(res && res.length){
                console.log('存在新闻,不插入')
                cb();
            }else{
                connection.query('insert into kweibo(tbinfo,mid,isforward,minfo,omid,text,sendAt,fname,fid,ftext,fsendAt) values(?,?,?,?,?,?,?,?,?,?,?)',data,function(err,result){
                    if(err){
                        console.log('kNewscom',err)
                    }
                    cb();
                })
            }
        })
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


//把文章列表存入数据库
exports.kCommentCom = function(list,callback){
    console.log('保存评论')
    var connection = list.connection
    async.forEach(list.res,function(item,cb){
        debug('保存评论',JSON.stringify(item));
        var data = [item.news_id,item.comment_id,item.name,item.isReply,item.repName,item.content]
        connection.query('select * from kweibo_c where comment_id = ?',[item.comment_id],function (err,res) {
            if(res &&res.length){
                console.log('存在评论,不插入')
                cb();
            }else{
                connection.query('insert into kweibo_c(news_id,comment_id,name,isReply,repName,content) values(?,?,?,?,?,?)',data,function(err,result){
                    if(err){
                        console.log('kCommentCom',err)
                    }
                    cb();
                });
            }
        })
    },callback);
}
