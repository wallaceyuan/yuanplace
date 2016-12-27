'use strict'
var conf = require('../../config/conf')
var util = require('../../libs/util')
var path = require('path')
var qiniu = require("qiniu");
qiniu.conf.ACCESS_KEY = conf.ACCESS_KEY
qiniu.conf.SECRET_KEY = conf.SECRET_KEY

var bucket = conf.bucket
var ip = conf.ip

exports.call = function *(next) {
    console.log('this.poster',this.poster)
    this.body = 200
}

exports.qiniuUpload = function *(next){
    var that = this
    var posterData = this.request.body.files.uploadPoster
    var name = posterData.name
    var res = {}
    if (name) {
        var timestamp = Date.now()
        var type = posterData.type.split('/')[1]
        //上传到七牛后保存的文件名
        var key = timestamp + '.' + type
        //生成上传 Token
        var token = uptoken(bucket, key);

        //要上传文件的本地路径
        var filePath = posterData.path
        //调用uploadFile上传
        var res = yield uploadFile(token, key, filePath)

        res.status = 200

        res.poster = `http://ohhtkbaxs.bkt.clouddn.com/${res.key}`

    }else{
        res.status = 302
    }

    this.body = res
    //yield next
}

//构建上传策略函数，设置回调的url以及需要回调给业务服务器的数据
function uptoken(bucket, key) {
    var putPolicy = new qiniu.rs.PutPolicy(bucket+":"+key);
    return putPolicy.token();
}

//构造上传函数
/*function cb(err, res) {
    if (err) return reject(err);
    if (arguments.length > 2) res = slice.call(arguments, 1);
    resolve(res);
}*/

function uploadFile(uptoken, key, localFile){
    var extra = new qiniu.io.PutExtra();
    return function(cb){
        qiniu.io.putFile(uptoken, key, localFile, extra, function(err, ret) {
            cb(err, ret)
        });
    }
}

exports.index = function *(next) {
    yield this.render('pages/upload/index', {
        title : 'upload',
    })
}

exports.editor = function *(next) {
    var files = this.request.body.files
    var posterData = files['editormd-image-file']
    var name = posterData.name
    if (name) {
        var timestamp = Date.now()
        var type = posterData.type.split('/')[1]
        //上传到七牛后保存的文件名
        var key = timestamp + '.' + type
        //生成上传 Token
        var token = uptoken(bucket, key);
        //要上传文件的本地路径
        var filePath = posterData.path
        //调用uploadFile上传
        var res = yield uploadFile(token, key, filePath)

        res.success = 1

        res.url = `http://ohhtkbaxs.bkt.clouddn.com/${res.key}`

        res.message = 'done'

    }else{
        res.success = 0
    }

    this.body = res

}

exports.uploadSave = function *(next) {
    var posterData = this.request.body.files.uploadPoster
    var filePath = posterData.path
    var name = posterData.name
    if (name) {
        var data = yield util.readFileAsync(filePath)
        var timestamp = Date.now()
        var type = posterData.type.split('/')[1]
        var poster = timestamp + '.' + type
        var newPath = path.join(__dirname, '../../', '/public/upload/' + poster)
        yield util.writeFileAsync(newPath,data)
        this.poster = ip+'/upload/'+poster
        var response = {'status':200,'url':this.poster}
        this.body = response
    }else{
        var response = {'status':302}
        this.body = response
    }
}