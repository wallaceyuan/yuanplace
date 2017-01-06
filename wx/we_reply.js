/**
 * Created by yuan on 2017/1/6.
 */
'use strict'

var config = require('./index')
var Wechat = require('../wechat/wechat')
var menu = require('./menu')
var wechatApi = new Wechat(config.wechatOptions.wechat);

var help = '哈哈，你来到了贞德厨客服中心'

exports.reply = function* (next){
    var message = this.weixin
    //console.log('message',message)
    if(message.MsgType === 'event'){
        if(message.Event === 'user_enter_tempsession'){
            this.body = help
        }
    }else if(message.MsgType === 'text'){
        this.body = message.Content
    }
    yield next
}