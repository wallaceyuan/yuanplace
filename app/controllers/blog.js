'use strict'

var _ = require('lodash')
var fs = require('fs')
var path = require('path')
var moment = require('moment')
var conf = require('../../config/conf')
var ip = conf.ip
var pool = conf.pool


exports.index = function *(next) {
    yield this.render('pages/blog/index', {
        title : 'blog',
    })
}

exports.new = function *(next) {
    yield this.render('pages/blog/new', {
        title : 'blog',
        blog : {id:0}
    })
}

exports.update = function *(next) {
    var id = this.params.id
    yield this.render('pages/blog/new', {
        title : 'blog',
        blog : {id:id}
    })
}

exports.save = function *(next) {
    var blogObj = this.request.body.fields || {}
    let id = blogObj.id
    if(id!=0){
        var sql = "UPDATE blog SET updateAt=?,markdown=?,content=?,category=? where id=?";
        yield p.query(sql,[new Date(),blogObj['test-editormd-markdown-doc'],blogObj['test-editormd-html-code'],1,id])
        this.redirect('/blog')
    }else{
        var sql = "insert into blog(createAt,updateAt,markdown,content,category) value(?,?,?,?,?)";
        var row = p.query(sql,[new Date(),new Date(),blogObj['test-editormd-markdown-doc'],blogObj['test-editormd-html-code'],1])
    }
}

exports.find = function *(next) {
    var id = this.params.id
    var h2m = ''
    if(id == 'undefined') return
    var movie = yield p.query('select * from blog where id=? limit 1',[id])
    if(movie.length){
        yield p.query('update blog set pv = pv +1 where id= ?',[id])
        var sql = 'SELECT content,markdown from blog WHERE id = ?'
        var blog = yield p.query(sql,[id])
        h2m = blog[0].markdown
    }
    this.body  = h2m
}

