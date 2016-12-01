
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
    if (name) {
        var timestamp = Date.now()
        var type = posterData.type.split('/')[1]
        //上传到七牛后保存的文件名
        var key = timestamp + '.' + type
        //生成上传 Token
        token = uptoken(bucket, key);
        //要上传文件的本地路径
        var filePath = posterData.path
        //调用uploadFile上传
        uploadFile(token, key, filePath,(res)=> {
            //console.log(res)
            this.poster = 'http://ohhtkbaxs.bkt.clouddn.com/1480586957212.png'
            yield next
        });
    }
    //yield next
}

//构建上传策略函数，设置回调的url以及需要回调给业务服务器的数据
function uptoken(bucket, key) {
    var putPolicy = new qiniu.rs.PutPolicy(bucket+":"+key);
    return putPolicy.token();
}

//构造上传函数
function uploadFile(uptoken, key, localFile,cb) {
    var extra = new qiniu.io.PutExtra();
    qiniu.io.putFile(uptoken, key, localFile, extra, function(err, ret) {
        if(!err) {
            console.log('success')
            // 上传成功， 处理返回值
            //console.log(ret.hash, ret.key, ret.persistentId);
            cb(ret.key)
        } else {
            console.log('error')
            // 上传失败， 处理返回代码
            console.log(err);
            cb(err)
        }
    });
}

exports.index = function *(next) {
    yield this.render('pages/upload/index', {
        title : 'upload',
    })
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