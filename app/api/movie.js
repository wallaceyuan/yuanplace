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

// index page
exports.findAll = function *() {
    var category = yield Category
        .find({})
        .populate({
            path: 'movies',
            select: 'title poster',
            options: { limit: 6 }
        })
        .exec()
    return category
}

// search page
exports.searchByCategory = function *(catId) {
    var categories = yield Category
        .find({_id:catId})
        .populate({
            path: 'movies',
            select: 'title poster'
        })
        .exec()
    return categories
}

exports.searchById = function *(id) {
    var movie = yield Movie
        .findOne({_id:id})
        .exec()
    return movie
}

function updateMovies(movie){
    var options = {
        url:'https://api.douban.com/v2/movie/subject/'+movie.doubanId,
        json:true
    }

    var db = function *(genre,data){
        var cate = p.query('SELECT id FROM category where movieId = ? limit 1',[movie.id])
        if(cate && cate.length > 0){
            console.log('update')
            yield p.query('update category set updateAt = ? where movieId = ?',[new Date(),movie.id])
        }else {
            console.log('insert')
            var cat_id = yield p.query('insert into category(name,movieId,createAt,updateAt) value(?,?,?,?)',[genre,movie.id,new Date(),new Date()])
            console.log(cat_id.insertId,data.countries[0],data.summary,movie.id)
            pool.query('update movie set category = ? , coutry = ? ,summary = ? where id = ?',[cat_id,'美国',summary,12],function(err,row){
                if(err){
                    console.log(err)
                }else{
                    console.log(row)
                }
            })
        }
    }
    request(options).then(function(response){
        var data = response.body;
        if(data.code == 5000) return
/*        _.extend(movie,{
            coutry:data.countries[0],
            summary:data.summary
        })*/
        var genres = data.genres
        if(genres && genres.length > 0){
            var cateArray = []
            genres.forEach(function(genre){
                cateArray.push(function *(){
                    yield db(genre,data)
                })
            });
            co(function *(){
                yield cateArray
            })
        }else{
            co(function *(){
                yield db(genres,data)
            })
            //movie.save()
        }
    });
}

exports.searchByDouban = function *(q){
    var options = {
        url:'https://api.douban.com/v2/movie/search?q=',
        json:true
    }
    options.url += encodeURIComponent(q)
    var reponse = yield koa_request(options)
    var _data = reponse.body;
    var subjects = []
    var movies = []
    if(_data && _data.subjects){
        subjects = _data.subjects
    }
    if(subjects.length > 0){
        var queryArray = []
        subjects.forEach(function(item){
            queryArray.push(function *(){
                var movie = yield p.query('SELECT * from movie where doubanId = ? LIMIT 1;',[item.id])
                if(movie.length > 0){
                    movies.push(movie)
                }else{
                    var directors = item.directors || []
                    var director = directors[0] || " "
                    var name = director.name || "暂无"
                    var genres = item.genres.join(',')
                    var row = yield p.query('insert into movie(director,title,doubanId,poster,year,genres) values(?,?,?,?,?,?)',[name,item.title,item.id,item.images.large,item.year,genres])
                    movie = {
                        director: name,
                        title: item.title,
                        doubanId: item.id,
                        poster: item.images.large,
                        year: item.year,
                        genres:genres,
                        id:row.insertId
                    }
                    movies.push(movie)
                }
            })
        })

        yield queryArray
        movies.forEach(function(movie){
            //console.log('movie',movie)
            updateMovies(movie)
        });
    }


    return movies
}


/*
exports.searchByDouban = function *(q){
    var options = {
        url:'https://api.douban.com/v2/movie/search?q=',
        json:true
    }
    options.url += encodeURIComponent(q)
    var reponse = yield koa_request(options)
    var _data = reponse.body;
    var subjects = []
    var movies = []
    if(_data && _data.subjects){
        subjects = _data.subjects
    }
    if(subjects.length > 0){
        var queryArray = []
        subjects.forEach(function(item){
            queryArray.push(function *(){
                var movie = yield Movie.findOne({doubanId: item.id})
                if(movie){
                    movies.push(movie)
                }else{
                    var directors = item.directors || []
                    var director = directors[0] || ""

                    movie = new Movie({
                        director: director.name || "",
                        title: item.title,
                        doubanId: item.id,
                        poster: item.images.large,
                        year: item.year,
                        genres:item.genres,

                    })
                    movie = yield movie.save();
                    movies.push(movie)
                }
            })
        })

        yield queryArray

        movies.forEach(function(movie){
            updateMovies(movie)
        });
    }


    return movies
}
*/

exports.findHotMovies = function *(hot,count){
    var movies = yield Movie
        .find().sort({"pv":hot}).limit(count)
        .exec()
    return movies
}

exports.searchByName = function *(q) {
    var movies = yield p.query('SELECT * FROM movie where title LIKE ?',[ q + '%'])
    return movies
}

exports.findMoviesByCat = function *(cat) {
    var category = yield Category
        .findOne({name:cat})
        .populate({
            path:'movies',
            select:'title poster _id'
        })
        .exec()
    return category
}