
var _ = require('lodash')
var wxlogin = require('../api/wxlogin')
var Wechat = require('../../wechat/wechat');
var config = require('../../wx/index')
//console.log(config.wechatOptions.xcx)
var wechatApi = new Wechat(config.wechatOptions.xcx);


exports.index = function *() {
    var code = this.query.code
    var value = yield wxlogin.session_key(code)
    var key = yield wxlogin.save_key(value)
    this.body = {"session":key}
}

exports.check = function *() {
    var session = this.query.session
    console.log('wxlogin session',session)
    var status = yield wxlogin.check_key(session)
    console.log('wxlogin status',status)
    if(status!=null){
        console.log(status)
        this.body = 200
    }else{
        this.body = 302
    }
}

exports.template = function *() {
    var data = this.request.body
    var session = data.session
    var redisData = yield wxlogin.check_key(session)
    var comp = _.assign(redisData,data);
    var result = yield wechatApi.repTemplate(comp);
    this.body = 200
}