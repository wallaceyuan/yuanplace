'use strict'

var _ = require('lodash')
var fs = require('fs')
var path = require('path')
var moment = require('moment')
var conf = require('../../config/conf')
var ip = conf.ip
var pool = conf.pool


exports.index = function *(next) {
    var blogs = yield p.query('select id,createAt,pv,title from blog ORDER BY createAt desc LIMIT 0,10')
    yield this.render('pages/blog/index', {
        title : 'blog',
        blogs : blogs
    })
}

exports.list = function *(next) {
    var page = parseInt(this.query.p, 10) || 1
    page = page?page:1

    var count = 10
    var sql = 'select id,createAt,pv,title from blog limit '+(page-1) * count+','+count

    var blogs = yield p.query(sql)
    var total = yield p.query('select count(*) as count from blog')
    total = total[0].count

    yield this.render('pages/blog/list', {
        totalPage: Math.ceil(total / count),
        currentPage: page,
        title : 'blog',
        type  : 'admin',
        blogs : blogs,
        total : total
    })
}

exports.del = function *(next) {
    var id = this.query.id
    if (id) {
        try{
            yield p.query('delete from blog where id=?',[id])
            this.body = {success: 1}
        }catch(err){
            console.log(err)
            this.body = {success: 0}
        }
    }
}

exports.new = function *(next) {
    var cats = yield p.query('select name,id from blog_category GROUP BY NAME')
    yield this.render('pages/blog/new', {
        title : 'blog',
        blog : {id:0},
        cats : cats
    })
}

exports.update = function *(next) {
    var cats = yield p.query('select name,id from blog_category GROUP BY NAME')
    var id = this.params.id
    yield this.render('pages/blog/new', {
        title : 'blog',
        blog : {id:id},
        cats : cats
    })
}

exports.save = function *(next) {
    var blogObj = this.request.body.fields || {}
    let title = blogObj.note_title
    let id = blogObj.id
    let checkbox = blogObj.checkbox
    if(id!=0){
        //更新category
        var res = yield p.query('SELECT name from blog_category WHERE blogId = ?',[id])
        var genres = []//旧
        res.map(function(v){
            genres.push(v.name)
        })

        var cs = _.difference(checkbox,genres)//新增

        var ds = _.difference(genres,checkbox)//删除

        var queryArray = []
        cs.map(function(c){
            queryArray.push(function *(){
                yield p.query('insert into blog_category(name,blogId,createAt,updateAt) value(?,?,?,?)',[c,id,new Date(),new Date()])
            })
        })
        yield queryArray

        var dsArray = []
        ds.map(function (d){
            dsArray.push(function *(){
                yield p.query('delete from blog_category where blogId =? and name=?',[id,d])
            })
        })
        yield dsArray

        var sql = "UPDATE blog SET title=?,updateAt=?,markdown=?,content=?,category=? where id=?";
        yield p.query(sql,[title,new Date(),blogObj['test-editormd-markdown-doc'],blogObj['test-editormd-html-code'],genres,id])
        this.redirect('/blog')
    }else{
        var sql = "insert into blog(title,createAt,updateAt,markdown,content,category) value(?,?,?,?,?,?)";
        var row = p.query(sql,[new Date(),new Date(),blogObj['test-editormd-markdown-doc'],blogObj['test-editormd-html-code'],checkbox.join(',')])
        this.redirect('/blog')
    }
}

exports.page = function *(next) {
    var id = this.params.id
    if(id == 'undefined') return
    var blog = yield p.query('select * from blog where id=? limit 1',[id])
    if(blog.length){
        yield p.query('update blog set pv = pv +1 where id= ?',[id])
    }
    yield this.render('pages/blog/page', {
        title: 'blog',
        blog: blog[0] || {},
    })
}

exports.find = function *(next) {
    var id = this.params.id
    var res = {}
    if(id == 'undefined') return
    var blog = yield p.query('select * from blog where id=? limit 1',[id])
    if(blog.length){
        var sql = 'SELECT content,markdown,category,title from blog WHERE id = ?'
        var blog = yield p.query(sql,[id])
        blog = blog[0]
        res.status = 200,res.md = blog.markdown,res.title = blog.title,res.category = blog.category
    }else{
        res.status = 302
    }
    this.body  = res
}

