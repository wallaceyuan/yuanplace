/**
 * Created by Yuan on 2016/9/7.
 */
var conf = require('../../config/conf')
var pool = conf.pool
var q = '三人行'
/*pool.query('SELECT * FROM movie where title LIKE ?',[ q + '%'],function(err,row,fields){
    if(err){
        console.log(err)
    }else{
        console.log(row)
    }
})*/

pool.query('insert into movie(director,title,doubanId,poster,year,genres) values(?,?,?,?,?,?)',[ 1,1,1,'https://img3.doubanio.com/view/movie_poster_cover/lpst/public/p1910908765.jpg',111,12], function (err, row) {
    if(err){
        console.log(err)
    }else{
        console.log(row)
    }
})