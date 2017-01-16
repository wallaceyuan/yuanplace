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
    var rows = yield p.query('SELECT t1.name,t1.movieId,t2.title,t2.poster,t2.id FROM category as t1, movie as t2 where t1.movieId = t2.id group by t1.name,t1.movieId')
    var cate = ''
    var category = new Array()
    rows.map(function(row) {
        var name = row.name
        var reg = eval('/'+name +'/g');
        if (cate.match(reg)) {
            category.map(function(cc){
                if(cc.name == row.name){
                    if(cc.movies.length >=6){
                        return
                    }
                    cc.movies.push(row)
                }
            })
        }else{
            cate += row.name
            var data = { id:row.id ,
                name: row.name,
                movies: [row]
            }
            category.push(data)
        }
    })
    return category
}

exports.findCates = function *(cat) {
    if(!cat) return []
    var rows = yield p.query('SELECT t1.name,t2.title,t2.poster,t2.id,t2.summary,t2.year FROM category as t1, movie as t2 where t1.name = ? and t1.movieId = t2.id',[cat])
    return rows
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
    var movie = yield p.query('SELECT * from movie where id= ? limit 1',[id])
    return movie
}

function updateMovies(movie){
    //console.log('updateMovies',movie)
    var options = {
        url:'https://api.douban.com/v2/movie/subject/'+movie.doubanId,
        json:true
    }
    var db = function *(genre,data){
        genre?genre:'暂无分类'
        var cate = p.query('SELECT id FROM category where movieId = ? and name = ? limit 1',[movie.id,genre])
        if(cate && cate.length > 0){
            yield p.query('update category set updateAt = ? where movieId = ?',[new Date(),movie.id])
        }else {
            yield p.query('insert into category(name,movieId,createAt,updateAt) value(?,?,?,?)',[genre,movie.id,new Date(),new Date()])
            var country =  data.countries[0] || ""
            var summary = data.summary || ""
            yield p.query('update movie set country = ?,summary = ? where id = ?',[country,summary,movie.id])
        }
    }
    request(options).then(function(response){
        var data = response.body;
        if(data.code == 5000) return
        var genres = data.genres
        if(genres && genres.length > 0){
            var cateArray = []
            genres.forEach(function(genre){
                console.log('forEach')
                cateArray.push(function *(){
                    console.log('db cate')
                    yield db(genre,data)
                })
            });
            co(function *(){
                console.log('co cateArray')
                yield cateArray
            })
        }else{
            co(function *(){
                console.log('db cate sin')
                yield db(genres,data)
            })
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
    //console.log(subjects)
    if(subjects.length > 0){
        var queryArray = []
        subjects.forEach(function(item){
            queryArray.push(function *(){
                var movie = yield p.query('SELECT * from movie where doubanId = ? LIMIT 1;',[item.id])
                //console.log('select movie',movie)
                if(movie.length > 0){
                    console.log('have this movies')
                    movies.push(movie[0])
                }else{
                    console.log('not have this movies search')
                    var directors = item.directors || []
                    var director = directors[0] || " "
                    var name = director.name || "暂无"
                    var genres = item.genres.join(',')
                    var row = yield p.query('insert into movie(director,title,doubanId,poster,year,genres,createAt,updateAt) values(?,?,?,?,?,?,?,?)',[name,item.title,item.id,item.images.large,item.year,genres,new Date(),new Date()])
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
        //console.log(movies)
        movies.forEach(function(movie){
            updateMovies(movie)
        });
    }
    //console.log('movies',movies)
    return movies
}

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