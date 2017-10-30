
'use strict'

var path = require('path');
var util = require('../libs/util');
var wechat_file = path.join(__dirname ,'../config/wechat.txt');
var ticket_file = path.join(__dirname ,'../config/ticket.txt');


var wx_wechat_file = path.join(__dirname,'../config/wx_wechat.txt')
var wx_ticket_file = path.join(__dirname,'../config/wx_ticket.txt')

var Wechat = require('../wechat/wechat');

var config = {
    wechat:{//
        appID : 'wx0527f87ddccbfe13',//wx0527f87ddccbfe13(开发者ID)//wxe539b74f1500b34f
        appSecret:'57eb18e3355100fcd80b00f0b0169a28',//57eb18e3355100fcd80b00f0b0169a28(开发者appSecret)//247fbdaee6f89a225345f7a56b5398b4
        token:'Wallace746cEtzB7o7fk',
        serverUrl:'http://www.wallaceyuan.cn',
        getAccessToken:function(){
            return util.readFileAsync(wechat_file,'utf-8')
        },
        getTicket:function(){
            return util.readFileAsync(ticket_file,'utf-8')
        },
        saveAccessToken:function(data){
            data = JSON.stringify(data);
            return util.writeFileAsync(wechat_file,data)
        },
        saveTicket:function(data){
            data = JSON.stringify(data);
            return util.writeFileAsync(ticket_file,data)
        }
    },
    xcx:{
        appID:'wxb442af437a754db6',
        appSecret:'264d4ba77a8b296376c32dbf16f38233',
        token:'Wallace746cEtzB7o7fk',
        getAccessToken:function(){
            return util.readFileAsync(wx_wechat_file,'utf-8')
        },
        saveAccessToken:function(data){
            data = JSON.stringify(data);
            return util.writeFileAsync(wx_wechat_file,data)
        }
    }
}

exports.wechatOptions = {
    wechat:config.wechat,
    xcx:config.xcx
}

exports.getWechat = function(){
    var wechatApi = new Wechat(config.wechat);
    return wechatApi
}
