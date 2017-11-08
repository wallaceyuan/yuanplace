var assert = require("assert")
var request = require('superagent');


describe('第一个测试',function () {
    it('测试数组是否包含某个元素',function () {
        should([1, 2, 3].indexOf(4)).equal(-1)
        //assert.equal(-1, [1, 2, 3].indexOf(4))
    })
})

describe('测试增加评论功能',function () {
    it('为电影添加一条评论',function (done) {
        request
            .post('http://127.0.0.1:3000/user/commentTest')
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