<<<<<<< HEAD

var Promise = require('bluebird');
var request = Promise.promisify(require('request'));
var wrapper = require('co-redis');

var config = require('../../wx/index.js')
var client_config = require('../../config/conf');
var client  = client_config.client;
var redisCo = wrapper(client);

function makeid(param) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for( var i=0; i < param; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}

var appID = config.wechatOptions.xcx.appID
var appSecret = config.wechatOptions.xcx.appSecret

exports.session_key = function *(code) {
    var session_url = `https://api.weixin.qq.com/sns/jscode2session?appid=${appID}&secret=${appSecret}&js_code=${code}&grant_type=authorization_code`
    return new Promise(function(resolve,reject){
        request({url:session_url,json:true}).then(function(response){
            //console.log('response body',response.body);
            var data = response.body;
            resolve(data);
        });
    })
}

exports.save_key = function *(value) {
    console.log('wxlogin save_key',value)
    var key = makeid(168)
    client.multi().HMSET(key, {session_key:value.session_key,openid:value.openid}).expire(key,300).exec(function (err, replies) {
        console.log("MULTI got " + replies.length + " replies");
    });
    return key
}

exports.check_key = function *(value){
    return redisCo.hgetall(value)
=======

var Promise = require('bluebird');
var request = Promise.promisify(require('request'));
var wrapper = require('co-redis');

var config = require('../../wx/index.js')
var client_config = require('../../config/conf');
var client  = client_config.client;
var redisCo = wrapper(client);

function makeid(param) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for( var i=0; i < param; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}

var appID = config.wechatOptions.xcx.appID
var appSecret = config.wechatOptions.xcx.appSecret

exports.session_key = function *(code) {
    var session_url = `https://api.weixin.qq.com/sns/jscode2session?appid=${appID}&secret=${appSecret}&js_code=${code}&grant_type=authorization_code`
    return new Promise(function(resolve,reject){
        request({url:session_url,json:true}).then(function(response){
            //console.log('response body',response.body);
            var data = response.body;
            resolve(data);
        });
    })
}

exports.save_key = function *(value) {
    console.log('wxlogin save_key',value)
    var key = makeid(168)
    client.multi().HMSET(key, {session_key:value.session_key,openid:value.openid}).expire(key,300).exec(function (err, replies) {
        console.log("MULTI got " + replies.length + " replies");
    });
    return key
}

exports.check_key = function *(value){
    return redisCo.hgetall(value)
>>>>>>> 0d3ea3112a579e19f29e07586fa6906c63c92ef5
}