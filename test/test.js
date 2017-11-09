const assert = require("assert")
const request = require('superagent');
const bcrypt = require('bcryptjs')
const SALT_WORK_FACTOR = 10
const users = require('../app/api/users')
const moment = require('moment')

describe('第一个测试',function () {
    it('测试数组是否包含某个元素',function () {
        [1, 2, 3].indexOf(4).should.equal(-1)
        //should([1, 2, 3].indexOf(4)).equal(-1)
        //assert.equal(-1, [1, 2, 3].indexOf(4))
    })
})

describe('测试增加评论功能',function () {
    it('为电影添加一条评论',function (done) {
        request
            .post('http://www.wallaceyuan.cn/user/commentTest')
            .send("comment%5Bmovie%5D=315&comment%5Bfrom%5D=13&comment%5Btid%5D=&comment%5Bcid%5D=&comment%5Bcontent%5D=mochatest")
            .set('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8')
            .end(function(err, res){
                should(res.body.success).equal(1)
                done();
            });
       /* request
            .get('https://api.github.com')
            .end(function(err, res){
                should(res).be.a.Object
                done();
            });*/
    })
})

describe('测试数据库',function () {
    var salt = ''
    var hash = ''
    var _user = {
        password:'mocha'
    }

    before(function(done) {
        salt = bcrypt.genSaltSync(SALT_WORK_FACTOR);
        hash = bcrypt.hashSync(_user.password, salt);
        _user.password = hash
        _user.name = moment(new Date()).format('Y-M-D H:mm:ss')
        done()
    });

    it('为电影添加一条评论',function *(){
        var newUser = yield users.saveUser(_user)
        should(newUser.name).equal(_user.name)
    })

    after(function () {
        
    })
})
