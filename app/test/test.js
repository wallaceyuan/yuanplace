/**
 * Created by Yuan on 2016/9/7.
 */
var conf = require('../../config/conf')
var util = require('../../libs/util')
var client  = conf.client;

var pool = conf.pool
var p = conf.p
var Promise = require('bluebird');
var request = Promise.promisify(require('request'));
var moment = require('moment')
var _ = require('lodash');
var co = require('co');
var moment = require('moment')


var p1 = Promise.resolve(3);
var p2 = 1337;
var p3 = new Promise((resolve, reject) => {
    setTimeout(resolve, 100, "foo");
});

Promise.all([p1, p2, p3]).then(values => {
    console.log(values); // [3, 1337, "foo"]
});
client.hgetall('ABcFEBwopzc6CAagmNYcNEqHVZwRef4xoWfsRPowPv8j0G4cacsvGlhwXcFWSyoppaIgpm86Bpoc4zWJeLWIrikCAlrJC96fLXASF0Ldthl2lVa4WcQryXiggWfowXArK1BWbaCCdSFCHVHVCK6Qq6hYw1W24ATLLcRDiulQ', function (err, obj) {
    if(err){
        //console.log(err)
    }else{
        //console.log(obj)
    }
});
/*var re = util.pageNav(10,25,1111)
console.log(re)*/

//var cs = _.difference([1],[])//新增
var ds = _.difference([1],[2])//新增

//console.log('cs',cs)
//console.log('ds',ds)
//console.log(_.difference([2, 1], [2, 3]))
var aa = 1
//console.log('tostring',typeof(aa.toString()))
//var aa = moment(new Date()).format('Y-M-D H:mm:ss')

/*pool.query('select * from movie ')

var aa = /爱情/g.test('剧情,爱情,情色')
console.log(aa)

var a = ['剧情','爱情','情色']

var b = ['爱情','情色','二次元']

var c = _.difference(a,b)

var d = _.difference(b,a)



var str = "回复@homeboy_ding:他说的是他在上海的老乡吧。310开头的有多少会没事跑到宜家去睡觉，要么吃饱了撑着没事做。上海也有那么差素质的人，他的老乡当记首功。"
var repName = str.match(/@(.+?):/i);
var cc = str.match(/:(.+?)$/i);*/
//console.log('repName',repName)
//console.log('xx',cc,str)


var str = "<iframe height='450' width='530' src='http://player.kankanews.com/embed/2016-10-19_0017729885' frameBorder='0' allowFullScreen />"
//var cc = str.match(/[http(.+?)$/i);
var patt = /http(.*?)'/gi;
var iUrl = str.match(patt)[0].split('\'')[0]
//console.log(iUrl)
/*pool.query('select * from kweibo where mid = ?',[4029132301983536],function (err,res) {
    if(res.length){
        console.log(res[0].text)
    }
})*/

//console.log(c,d)
//let difference = a.concat(b).filter(v => !a.includes(v) || !b.includes(v))
/*
var str = '/comments/reply/EcaDjeKXF/4029033097983302?rl=1&st=55907d'
var arr = str.match(/\/([0-9]+)?/g).pop()
console.log(arr.toString().replace(/\//,''))
console.log(str.match(/\/([0-9]+)?/g))
*/

var aaa = [1,2,3,4,5]
var aaaaa = aaa.concat(['','','',''])
//console.log(aaaaa)

console.log(typeof ([1,2]),typeof (1))

/*var d = "1[ddd]sfdsaf[ccc]fdsaf[bbbb]";
var patt = /\[\/^\]]+\]/g;

var pattern =/\/(\d+.+?)?/g;

console.log(str.match(pattern))*/
/*
pool.query('SELECT * FROM category group by name,movie',function(err,row){
    console.log(err,row)
})
*/
/*var total = [0, 1, 2, 3].reduce(function(a, b) {
    console.log(a,b)
    return a + b;
}, 0);
console.log(total)*/

/*
pool.query('SELECT * FROM category LEFT JOIN movie on category.movieId = movie.id group by name,movieId',function(err,rows){
    var cate = ''
    var ccs = new Array()
    rows.map(function(row) {
        var name = row.name
        var reg = eval('/'+name +'/g');
        console.log(cate,name)
        if (cate.match(reg)) {
            console.log('match')
            ccs.map(function(cc){
                if(cc.name == row.name){
                    cc.movies.push(row)
                }
            })
        }else{
            console.log('not match')
            cate += row.name
            var data = { id:row.id ,
                name: row.name,
                meta: { updateAt: row.updateAt,
                        createAt: row.createAt
                    },
                movies: [{row}]
            }
            ccs.push(data)
        }
    })
    console.log(ccs)
})
*/

/*var aa = [1,2,3,4,5]
var ad = aa.find(1)
console.log(ad)*/
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

/*var movie = {
    director: 12,
    title: 12,
    doubanId: 1111,
    poster: 111111111,
    year: 1234,
    genres:'剧情,言情',
    id:123
}

var cat_id = 142,
    summary = '政客Peter（克里斯·诺斯 Chris Noth 饰）因性丑闻和政治丑闻被捕入狱后，妻子Alicia （朱丽安娜· 玛格丽丝 Julianna Margulies 饰）只能结束“家庭主妇”的生活，独支撑家庭的重任。'
pool.query('update movie set category = ? , coutry = ? ,summary = ? where id = ?',[cat_id,'美国',summary,12],function(err,row){
    if(err){
        console.log(err)
    }else{
        console.log(row)
    }
})*/





/*updateMovies(movie)

function updateMovies(movie){
    var options = {
        url:'https://api.douban.com/v2/movie/subject/24843210',
        json:true
    }

    var db = function *(genre){
        var cate = p.query('SELECT id FROM category where movieId = ? limit 1',[movie.id])
        if(cate && cate.length > 0){
            yield p.query('update category set updateAt = ? where movieId = ?',[new Date(),movie.id])
        }else {
            var cat_id = yield p.query('insert into category(name,movieId,createAt,updateAt) value(?,?,?,?)',[genre,movie.id,new Date(),new Date()])
            yield p.query('update movie set category = ? and coutry = ? and summary = ? where id = ?',[cat_id,data.countries[0],data.summary,movie.id])
        }
    }
    request(options).then(function(response){
        var data = response.body;
        if(data.code == 5000) return
        /!*        _.extend(movie,{
         coutry:data.countries[0],
         summary:data.summary
         })*!/
        var genres = data.genres
        if(genres && genres.length > 0){
            var cateArray = []
            genres.forEach(function(genre){
                cateArray.push(function *(){
                    yield db(genre)
                })
            });
            co(function *(){
                yield cateArray
            })
        }else{
            co(function *(){
                yield db(genres)
            })
            //movie.save()
        }
    });
}*/

/*pool.query('update movie set pv = pv +1 where id=1 ',function(err, row){
    console.log(err,row)
})*/

/*
pool.query('select * from movie where id=1 limit 1',function(err, row){
    console.log(err,row)
})
*/

/*pool.query('select * from users where name=1 limit 1',function(err, row){
    console.log(err,row)
})*/

/*pool.query('select id from users where name = ? limit 1',[1],function(err,res){
    console.log(err,res)
})*/
/*
co(function *(){
    var aa = yield p.query('select name,password from users where id = ? limit 1',[1])[0]
    console.log(aa)
})
*/
var  a = 5;

function test(){
    a = 0;
    console.log(a);
    console.log(this.a)
    var a;
    console.log(a)
}
test()
new test()
