/**
 * Created by yuan on 2016/9/7.
 */

var mysql = require('mysql');
var wrapper = require('co-mysql')

/*var client = require("redis").createClient(6379, "knews-redis2.nrm01e.ng.0001.cnn1.cache.amazonaws.com.cn");
 var ip = 'http://danmaku.kankanews.com';
 var host = 'knews-redis2.nrm01e.ng.0001.cnn1.cache.amazonaws.com.cn';
 var pool = mysql.createPool({
 host:'kankanewsapi.cjspd4t43dgd.rds.cn-north-1.amazonaws.com.cn',
 user:'kankanewsapi',
 password:'kankanewsaws2016',
 database:'kk_danmaku',
 connectTimeout:30000
 });*/

var ip = 'http://127.0.0.1:3000';
var host = 'localhost';
var pool = mysql.createPool({
    host:'127.0.0.1',
    user:'root',
    password:'admin',
    database:'yuan_place',
    connectTimeout:30000
});
p = wrapper(pool);
var ACCESS_KEY = 'hnFPlvlB8QmBiBen8XTa8KEZ_soaiNbzpscllVvv'
var SECRET_KEY = 'dWGPV89YN8eHM59qF4ehaahpWbz2FtvF65NVnPob'
var bucket     = 'wallaceyuan'



module.exports = {
    ip    : ip,
    pool  : pool,
    p     : p,
    host  : host,
    photo : 5,
    ACCESS_KEY:ACCESS_KEY,
    SECRET_KEY:SECRET_KEY,
    bucket:bucket
}

