'use strict'

var mongoose = require('mongoose')
var Movie = mongoose.model('Movie')
var Category = mongoose.model('Category')
var Comment = mongoose.model('Comment')
var _ = require('lodash')
var fs = require('fs')
var path = require('path')
var moment = require('moment')

// detail page
exports.detail = function *(next) {

    var id = this.params.id

    if(id == 'undefined') return

    yield p.query('update movie set pv = pv +1 where id= ?',[id])

    var movie = yield p.query('select * from movie where id=? limit 1',[id])

    var sqlS = 'select t1.id,t1.parent_id,t1.parent_name,t1.movie_id,t1.user_id,t1.createAt,t1.content,t2.`name` from comments as t1,users as t2 where t2.id = t1.user_id and t1.movie_id=?'

    var comments = yield p.query(sqlS,[id])

    comments.map(function(cmt){
        cmt.createAt = moment(cmt.createAt).format('Y-M-D H:mm:ss')
    })

    yield this.render('pages/detail', {
        title: 'imooc 详情页',
        movie: movie[0],
        comments: comments
    })
}

// admin new page
exports.new = function *(next) {
  var categories = yield Category.find({}).exec()
  yield this.render('pages/admin', {
    title: 'imooc 后台录入页',
    categories: categories,
    movie: {}
  })
}

// admin update page
exports.update = function *(next) {
    var id = this.params.id
    if (id) {
        var movie = yield p.query('select * from movie where id = ?',[id])
        movie = movie[0]
        console.log(movie)
        var categories = yield p.query('SELECT name from category GROUP BY name')
        yield this.render('pages/admin', {
            title: 'movie 后台更新页',
            movie: movie,
            categories: categories
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
    this.poster = poster
  }
    yield next
}

// admin post movie
exports.save = function *(next) {
    console.log('save');
    var movieObj = this.request.body.fields || {}
    var _movie

    if (this.poster) {
        movieObj.poster = this.poster
    }
    if (movieObj.id) {
        console.log('movieObj',movieObj)
        //var movie = yield Movie.findOne({_id: movieObj._id}).exec()
        var movie = yield p.query('select * from movie where id = ?',[movieObj.id])

        _movie = _.extend(movie[0], movieObj)

        console.log('_movie',_movie)
        //yield _movie.save()

        //this.redirect('/movie/' + movie._id)
    }
    else {
        _movie = new Movie(movieObj)

        var categoryId = movieObj.category
        var categoryName = movieObj.categoryName

        var movie = yield _movie.save()

        if (categoryId) {
            let category = yield Category.findOne({_id: categoryId}).exec()

            category.movies.push(movie._id)
            yield category.save()

            this.redirect('/movie/' + movie._id)
        }
        else if (categoryName) {
            let category = new Category({
                name: categoryName,
                movies: [movie._id]
            })

            yield category.save()
            movie.category = category._id
            yield movie.save()

            this.redirect('/movie/' + movie._id)
        }
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
        totalPage: Math.ceil(total / count),
        title: 'movie 列表页',
        movies: movies,
        currentPage: page
    })
}

// list page
exports.del = function *(next) {
  var id = this.query.id

  if (id) {
    try{
      yield Movie.remove({_id: id}).exec()
      this.body = {success: 1}
    }catch(err){
      //res.json({success: 0})
      this.body = {success: 0}
    }
  }
}