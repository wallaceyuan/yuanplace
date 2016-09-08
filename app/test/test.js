/**
 * Created by Yuan on 2016/9/7.
 */
var conf = require('../../config/conf')
var pool = conf.pool
var Promise = require('bluebird');
var request = Promise.promisify(require('request'));
var moment = require('moment')
var _ = require('lodash');
var co = require('co');
/*var q = '三人行'
pool.query('SELECT * FROM movie where title LIKE ?',[ q + '%'],function(err,row,fields){
    if(err){
        console.log(err)
    }else{
        console.log(row)
    }
})*/

/*pool.query('insert into movie(director,title,doubanId,poster,year,genres) values(?,?,?,?,?,?)',[ 1,1,1,'https://img3.doubanio.com/view/movie_poster_cover/lpst/public/p1910908765.jpg',111,12], function (err, row) {
    if(err){
        console.log(err)
    }else{
        console.log(row)
    }
})*/


/*var aa = moment().format("YYYY-MM-DD HH:MM:SS");
console.log(aa)
pool.query('insert into category(name,movieId,createAt,updateAt) value(?,?,?,?)',[2,2,new Date(),new Date()],function(err,res){
    console.log(err)
    console.log(res)
})
pool.query('SELECT id FROM category where movieId = ? limit 1',[82],function(err,row,fields){
    if(err){
        console.log(err)
    }else{
        console.log(row)
    }
})*/

/*pool.query('update category set updateAt = ? where movieId = ?',[new Date(),123],function(err,res){
    console.log(err,res)
})*/

/*

var genres=[
    "剧情",
    "历史",
    "战争"
]

var aa = genres.join(',')
console.log(aa)*/

var movie = {
    director: 12,
    title: 12,
    doubanId: 1111,
    poster: 111111111,
    year: 1234,
    genres:'剧情,言情',
    id:123
}

updateMovies(movie)

function updateMovies(movie){
    var options = {
        url:'https://api.douban.com/v2/movie/subject/4122269',
        json:true
    }
    request(options).then(function(response){
        var data = response.body;
        if(data.code == 5000) return
        _.extend(movie,{
            coutry:data.countries[0],
            summary:data.summary
        })
        var genres = data.genres
        if(genres && genres.length > 0){
            var cateArray = []
            genres.forEach(function(genre){
                cateArray.push(function *(){
                    console.log('genre',genre)
                    pool.query('SELECT id FROM category where movieId = ? limit 1',[movie.id],function(err,cate){
                        if(err){
                            console.log(err)
                        }else{
                            console.log(93,cate)
                        }
                        if(cate.length > 0){
                            pool.query('update category set updateAt = ? where movieId = ?',[new Date(),movie.id])
                        }else{
                            pool.query('insert into category(name,movieId,createAt,updateAt) value(?,?,?,?)',[genre,movie.id,new Date(),new Date()],function(err,row){
                                if(err){
                                    console.log(err)
                                }else{
                                    console.log(row)
                                }
                            })

                        }
                    })
                    /*                    var cate = p.query('SELECT id FROM category where movieId = ? limit 1',[movie.id])
                     if(cate){
                     yield p.query('update category set updateAt = ? where movieId = ?',[new Date(),movie.id])
                     }else {
                     var cat_id = yield p.query('insert into category(name,movieId,createAt,updateAt) value(?,?,?,?)',[genre,movie.id,new Date(),new Date()])
                     yield p.query('update movie set category = ? where id = ?',[cat_id,movie.id])
                     }*/
                })
            });
            co(function *(){
                yield cateArray
            })
        }else{
            var cate = p.query('SELECT id FROM category where movieId = ? limit 1',[movie.id])
            co(function *(){
                if(cate){
                    yield p.query('update category set updateAt = ? where movieId = ?',[new Date(),movie.id])
                }else {
                    var cat_id = yield p.query('insert into category(name,movieId,createAt,updateAt) value(?,?,?,?)',[genres,movie.id,new Date(),new Date()])
                    yield p.query('update movie set category = ? where id = ?',[cat_id,movie.id])
                }
            })
            //movie.save()
        }
    });
}

