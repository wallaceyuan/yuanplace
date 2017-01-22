'use strict'

var _ = require('lodash')
var fs = require('fs')
var path = require('path')
var moment = require('moment')
var conf = require('../../config/conf')
var ip = conf.ip
var pool = conf.pool

exports.index = function *(next) {
    var page = parseInt(this.query.p, 10) || 1
    page = page?page:1
    var count = 6

    var cates = yield p.query('select id,name from cate_name')
    var id = this.params.id
    if(id){
        var total = yield p.query('select count(*) as count from blog left join blog_category as cat on blog.id = cat.blogId where cat.cateId = ?',[id])
        total = total[0].count
        var sql = 'select blog.* from blog left join blog_category as cat on blog.id = cat.blogId where cat.cateId = ? limit '+''+(page-1) * count+','+count
        var blogs = yield p.query(sql,[id])
    }else{
        var total = yield p.query('select count(*) as count from blog')
        total = total[0].count
        var blogs = yield p.query('select id,createAt,pv,title,titlepic from blog ORDER BY createAt desc limit '+(page-1) * count+','+count)
    }
    yield this.render('pages/blog/index', {
        totalPage: Math.ceil(total / count),
        currentPage: page,
        title : 'blog',
        blogs : blogs,
        cates : cates,
        total : total,
        id    : id || 0
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
        total : total,
        path  : 'blog'
    })
}

exports.del = function *(next) {
    var id = this.query.id
    if (id) {
        try{
            yield p.query('delete from blog_category where blogId=?',[id])
            yield p.query('delete from blog where id=?',[id])
            this.body = {success: 1}
        }catch(err){
            console.log(err)
            this.body = {success: 0}
        }
    }
}

exports.cate_update = function *(next) {
    var body = this.request.body
    if(body.id){
        yield p.query('update cate_name set name = ? where id = ?',[body.cate,body.id])
    }else{
        yield p.query('insert into cate_name(name) value(?)',[body.cate])
    }
    this.body = 200
}

exports.cate_del = function *(next) {
    var id = this.query.id
    if (id) {
        try{
            yield p.query('delete from cate_name where id=?',[id])
            yield p.query('delete from blog_category where cateId=?',[id])
            this.body = {success: 1}
        }catch(err){
            console.log(err)
            this.body = {success: 0}
        }
    }
}

exports.new = function *(next) {
    var cats = yield p.query('select name,id from cate_name')
    yield this.render('pages/blog/new', {
        title : 'blog',
        blog : {id:0},
        cats : cats
    })
}

exports.update = function *(next) {
    var cats = yield p.query('select name, id from cate_name')
    var id = this.params.id
    yield this.render('pages/blog/new', {
        title : 'blog',
        blog : {id:id},
        cats : cats,
        path : 'blog'
    })
}

exports.cate = function *(){
    var cats = yield p.query('select name, id from cate_name')
    yield this.render('pages/blog/cate', {
        title : 'blog',
        cats : cats,
        type : "admin",
        path : 'blog'
    })
}

exports.save = function *(next) {
    var blogObj = this.request.body.fields || {}
    let title = blogObj.note_title
    let id = blogObj.id
    let checkbox = blogObj.checkbox
    var cates
    //console.log('blogObj',blogObj)
    //console.log('checkbox',checkbox,typeof(checkbox),checkbox )
    if(checkbox){
        cates = typeof(checkbox) == 'object'? checkbox.join(','):checkbox
        checkbox = typeof(checkbox) == 'object'? checkbox:[checkbox]
    }else{
        cates = ''
        checkbox = []
    }
    //console.log('checkbox',checkbox )
    if(id!=0){
        //更新category
        var res = yield p.query('SELECT cateId from blog_category WHERE blogId = ?',[id])
        var genres = []//旧
        res.map(function(v){
            genres.push(v.cateId.toString())
        })

        var cs = _.difference(checkbox,genres)//新增

        var ds = _.difference(genres,checkbox)//删除

        //console.log(genres,checkbox,cs,ds)

        var queryArray = []
        cs.map(function(c){
            queryArray.push(function *(){
                yield p.query('insert into blog_category(cateId,blogId,createAt,updateAt) value(?,?,?,?)',[c,id,new Date(),new Date()])
            })
        })
        yield queryArray

        var dsArray = []
        ds.map(function (d){
            dsArray.push(function *(){
                yield p.query('delete from blog_category where blogId =? and cateId=?',[id,d])
            })
        })

        yield dsArray

        var sql = "UPDATE blog SET title=?,updateAt=?,markdown=?,content=?,category=?,titlepic=? where id=?";
        //console.log('markdown',blogObj['test-editormd-markdown-doc'])
        //console.log('html',blogObj['test-editormd-html-code'])
        yield p.query(sql,[title,new Date(),blogObj['test-editormd-markdown-doc'],blogObj['test-editormd-html-code'],cates,blogObj['titlepic'],id])
        this.redirect('/admin/blog/list')
    }else{
        console.log('insert')
        var sql = "insert into blog(title,createAt,updateAt,markdown,content,category,titlepic) value(?,?,?,?,?,?,?)";
        var row = yield p.query(sql,[title,new Date(),new Date(),blogObj['test-editormd-markdown-doc'],blogObj['test-editormd-html-code'],cates,blogObj['titlepic']])
        var queryArray = []
        checkbox.map(function (c) {
            queryArray.push(function *() {
                yield p.query('insert into blog_category(cateId,blogId,createAt,updateAt) value(?,?,?,?)',[c,row.insertId,new Date(),new Date()])
            })
        })
        yield queryArray
        this.redirect('/admin/blog/list')
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
        var sql = 'SELECT content,markdown,category,title,titlepic from blog WHERE id = ?'
        var blog = yield p.query(sql,[id])
        blog = blog[0]
        res.status = 200,res.md = blog.markdown,res.title = blog.title,res.category = blog.category, res.titlepic =  blog.titlepic
    }else{
        res.status = 302
    }
    this.body  = res
}

