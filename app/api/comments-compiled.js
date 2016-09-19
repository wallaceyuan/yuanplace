/**
 * Created by yuan on 2016/9/19.
 */
'use strict';

var mongoose = require('mongoose');
var Movie = mongoose.model('Movie');
var Category = mongoose.model('Category');
var koa_request = require('koa-request');
var Promise = require('bluebird');
var request = Promise.promisify(require('request'));
var _ = require('lodash');
var co = require('co');
var conf = require('../../config/conf');
var pool = conf.pool;
var p = conf.p;

// comment
exports.save = function* (next) {
    var _comment = this.request.body.comment;
    console.log(_comment);

    var cid = _comment.cid ? _comment.cid : 0;

    var c_v = [cid, _comment.movie, _comment.from, new Date(), new Date(), _comment.content, ''];

    var res = yield p.query('insert into comments(parent_id,movie_id,user_id,createAt,updateAt,content,thread) value(?,?,?,?,?,?,?)', c_v);

    console.log(res);

    this.body = { success: 1 };
    /*  var movieId = _comment.movie
       if (_comment.cid) {
       let comment = yield Comment.findOne({_id: _comment.cid}).exec()
     var reply = {
     from: _comment.from,
     to: _comment.tid,
     content: _comment.content
     }
     comment.reply.push(reply)
     yield comment.save()
     this.body = { success :1 }
     }
     else {
     var comment = new Comment({
     movie:_comment.movie,
     from:_comment.from,
     content:_comment.content
     })
     yield comment.save()
     this.body = { success :1 }
     }*/
};

//# sourceMappingURL=comments-compiled.js.map