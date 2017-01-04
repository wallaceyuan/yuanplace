'use strict'

//var mongoose = require('mongoose')
//var Movie = mongoose.model('Movie')
//var Category = mongoose.model('Category')
var _ = require('lodash')
var fs = require('fs')
var path = require('path')
var moment = require('moment')
var conf = require('../../config/conf')
var ip = conf.ip


// detail page
exports.detail = function *(next) {

    var id = this.params.id

    if(id == 'undefined') return


    var movie = yield p.query('select * from movie where id=? limit 1',[id])

    if(movie.length){

        yield p.query('update movie set pv = pv +1 where id= ?',[id])

        var sqlS = 'select t1.id,t1.parent_id,t1.parent_name,t1.movie_id,t1.user_id,t1.createAt,t1.content,t2.`name` from comments as t1,users as t2 where t2.id = t1.user_id and t1.movie_id=?'

        var comments = yield p.query(sqlS,[id])

        comments.map(function(cmt){
            cmt.createAt = moment(cmt.createAt).format('Y-M-D H:mm:ss')
        })
    }

    yield this.render('pages/detail', {
        title: 'imooc 详情页',
        movie: movie[0] || {},
        comments: comments || ''
    })
}

// admin new page
exports.new = function *(next) {
    var categories = yield p.query('SELECT name from category GROUP BY name')
    yield this.render('pages/admin', {
        title: 'movie 后台录入页',
        categories: categories,
        movie: {},
        type: 'admin'
    })
}

// admin update page
exports.update = function *(next) {
    var id = this.params.id
    if (id) {
        var movie = yield p.query('select * from movie where id = ?',[id])
        movie = movie[0]
        var categories = yield p.query('SELECT name from category GROUP BY name')
        yield this.render('pages/admin', {
            title : 'movie 后台更新页',
            movie : movie,
            categories : categories,
            type : 'admin',
            path : 'movie'
        })
    }
}

var util = require('../../libs/util')

// admin poster
exports.savePoster = function *(next) {
    var posterData = this.request.body.files.uploadPoster
    var filePath = posterData.path
    var name = posterData.name
    if (name) {
        var data = yield util.readFileAsync(filePath)
        var timestamp = Date.now()
        var type = posterData.type.split('/')[1]
        var poster = timestamp + '.' + type
        var newPath = path.join(__dirname, '../../', '/public/upload/' + poster)
        yield util.writeFileAsync(newPath,data)
        this.poster = ip+'/upload/'+poster
    }
    yield next
}

// admin post movie
exports.save = function *(next) {
    //console.log('save');
    var movieObj = this.request.body.fields || {}
    var _movie

    var id = movieObj.id

    if (this.poster) {
        movieObj.poster = this.poster
    }

    var dataList = []
    delete movieObj.id
    delete movieObj.category
    for(var k in movieObj){
        dataList.push(movieObj[k])
    }

    if (id) {

        var movie = yield p.query('select * from movie where id = ?',[movieObj.id])

        dataList.push(new Date(),id)

        //更新movie
        var sql = "UPDATE movie SET genres = ?,title=?,director=?,country=?,language=?,poster=?,flash=?,year=?,summary=?,updateAt=? where id=?";
        yield p.query(sql,dataList)

        //更新category
        var newG = movieObj.genres.split(',')// 新
        var res = yield p.query('SELECT name from category WHERE movieId = ?',[id])
        var genres = []//旧
        res.map(function(v){
            genres.push(v.name)
        })

        var cs = _.difference(newG,genres)//新增

        var ds = _.difference(genres,newG)//删除

        var queryArray = []
        cs.map(function(c){
            queryArray.push(function *(){
                yield p.query('insert into category(name,movieId,createAt,updateAt) value(?,?,?,?)',[c,id,new Date(),new Date()])
            })
        })
        yield queryArray

        var dsArray = []
        ds.map(function (d){
            dsArray.push(function *(){
                yield p.query('delete from category where movieId =? and name=?',[id,d])
            })
        })
        yield dsArray

        this.redirect('/admin/movie/list')
    }
    else {
        console.log('insert',movieObj.poster)
        dataList.push(new Date())
        var sql = "insert into movie(genres,title,director,country,language,poster,flash,year,summary,createAt) value(?,?,?,?,?,?,?,?,?,?)";
        var row = yield p.query(sql,dataList)
        var id = row.insertId

        var newG = movieObj.genres.split(',')// 新
        var queryArray = []
        newG.map(function(c){
            queryArray.push(function *(){
                yield p.query('insert into category(name,movieId,createAt,updateAt) value(?,?,?,?)',[c,id,new Date(),new Date()])
            })
        })
        yield queryArray
        //yield p.query('insert into category(name,movieId,createAt,updateAt) value(?,?,?,?)',[movieObj.genre,id,new Date(),new Date()])
        this.redirect('/movie/' + id)
    }
}
// list page
exports.list = function *(next) {
    var page = parseInt(this.query.p, 10) || 1
    page = page?page:1

    var count = 10
    var sql = 'select * from movie limit '+(page-1) * count+','+count

    var movies = yield p.query(sql)
    var total = yield p.query('select count(*) as count from movie')
    total = total[0].count

    yield this.render('pages/list', {
        totalPage : Math.ceil(total / count),
        currentPage : page,
        title : 'movie 列表页',
        movies : movies,
        type :'admin',
        path : 'movie'
    })
}

// list page
exports.del = function *(next) {
  var id = this.query.id
  if (id) {
    try{
        yield p.query('delete from category where movieId=?',[id])
        yield p.query('delete from movie where id=?',[id])
        this.body = {success: 1}
    }catch(err){
        console.log(err)
        this.body = {success: 0}
    }
  }
}