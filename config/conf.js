/**
 * Created by yuan on 2016/9/7.
 */

var mysql = require('mysql');
var wrapper = require('co-mysql')

var ip = 'http://127.0.0.1:3000';
var host = 'localhost';
var pool = mysql.createPool({
    host:'127.0.0.1',
    user:'root',
    password:'123456',
    database:'yuan_place',
    connectTimeout:30000
});

p = wrapper(pool);

var ACCESS_KEY = 'hnFPlvlB8QmBiBen8XTa8KEZ_soaiNbzpscllVvv'
var SECRET_KEY = 'dWGPV89YN8eHM59qF4ehaahpWbz2FtvF65NVnPob'
var bucket     = 'wallaceyuan'

var client   = require("redis").createClient();

/*var client = require('redis').createClient();
client.auth('wallace741130')*/


module.exports = {
    ip    : ip,
    pool  : pool,
    p     : p,
    host  : host,
    photo : 5,
    ACCESS_KEY:ACCESS_KEY,
    SECRET_KEY:SECRET_KEY,
    bucket:bucket,
    client:client
}