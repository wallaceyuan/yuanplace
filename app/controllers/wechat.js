/**
 * Created by Yuan on 2016/8/7.
 */
var wechat = require('../../wechat/g');
var reply = require('../../wx/reply');
var wx = require('../../wx/index');

var we_reply = require('../../wx/we_reply');
var xcx = require('../../wechat/g_xcx')


exports.hear = function *(next){
    this.middle = wechat(wx.wechatOptions.wechat, reply.reply)
    yield this.middle(next)
}

exports.xcxHear = function *(next) {
    this.middle = xcx(wx.wechatOptions.xcx, we_reply.reply)
    yield this.middle(next)
}