/**
 * Created by yuan on 2017/1/6.
 */
'use strict'

var config = require('./index')
var Wechat = require('../wechat/wechat')
var menu = require('./menu')
var wechatApi = new Wechat(config.wechatOptions.wechat);

var help = '哈哈，你来到了贞德厨客服中心，回复1给你看我的老婆~'

exports.reply = function* (next){
    var message = this.weixin
    //console.log('message',message)
    if(message.MsgType === 'event'){
        if(message.Event === 'user_enter_tempsession'){
            this.body = help
        }
    }else if(message.MsgType === 'text'){
        var content = message.Content;
        var reply = content
        if(content == 1){
            var data = yield wechatApi.uploadMaterial('image', __dirname + '/vendor/2.jpg');
            console.log('data',data)
            reply = {
                "type":'image',
                "media_id":data.media_id
            }
        }
        this.body = reply
    }else if(message.MsgType === 'image'){
        this.body = {
            type:'image',
            cnt:'你发了一张图片'
        }
    }
    yield next
}