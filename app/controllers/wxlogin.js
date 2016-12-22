

var wxlogin = require('../api/wxlogin')

exports.index = function *() {
    var code = this.query.code
    var value = yield wxlogin.session_key(code)
    var key = yield wxlogin.save_key(value)
    this.body = {"session":key}
}

exports.check = function *() {
    var session = this.query.session
    var status = yield wxlogin.check_key(session)
    console.log('status',status)
    if(status){
        console.log(status)
        this.body = 200
    }else{
        this.body = 302
    }

}