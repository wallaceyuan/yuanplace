<<<<<<< HEAD
/**
 * Created by yuan on 2016/9/19.
 */
'use strict'
var mongoose = require('mongoose')
var Movie = mongoose.model('Movie')
var Category = mongoose.model('Category')
var koa_request = require('koa-request')
var Promise = require('bluebird');
var request = Promise.promisify(require('request'));
var _ = require('lodash');
var co = require('co');
var conf = require('../../config/conf')
var pool = conf.pool
var p = conf.p

// comment
exports.save = function *(next) {
    var _comment = this.request.body.comment
    var tid = _comment.tid?_comment.tid:0
    var cid = _comment.cid?_comment.cid:0
    if(tid){
        var name = yield  p.query('select name from users where id = ?',[tid])
        name = name[0].name
    }else{
        name = ''
    }
    var c_v = [cid,name,_comment.movie,_comment.from,new Date(),new Date(),_comment.content,'']

    yield p.query('insert into comments(parent_id,parent_name,movie_id,user_id,createAt,updateAt,content,thread) value(?,?,?,?,?,?,?,?)',c_v)

    this.body = { success :1 }
=======
/**
 * Created by yuan on 2016/9/19.
 */
'use strict'
var mongoose = require('mongoose')
var Movie = mongoose.model('Movie')
var Category = mongoose.model('Category')
var koa_request = require('koa-request')
var Promise = require('bluebird');
var request = Promise.promisify(require('request'));
var _ = require('lodash');
var co = require('co');
var conf = require('../../config/conf')
var pool = conf.pool
var p = conf.p

// comment
exports.save = function *(next) {
    var _comment = this.request.body.comment
    var tid = _comment.tid?_comment.tid:0
    var cid = _comment.cid?_comment.cid:0
    if(tid){
        var name = yield  p.query('select name from users where id = ?',[tid])
        name = name[0].name
    }else{
        name = ''
    }
    var c_v = [cid,name,_comment.movie,_comment.from,new Date(),new Date(),_comment.content,'']

    yield p.query('insert into comments(parent_id,parent_name,movie_id,user_id,createAt,updateAt,content,thread) value(?,?,?,?,?,?,?,?)',c_v)

    this.body = { success :1 }
>>>>>>> 0d3ea3112a579e19f29e07586fa6906c63c92ef5
}