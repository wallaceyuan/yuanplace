/**
 * Created by Yuan on 2016/6/28.
 */
'use strict'
var Koa = require('koa');
var fs = require('fs')
var app = new Koa();
var path = require('path');
var session = require('koa-session')
var bodyParser = require('koa-bodyparser');
var views = require('koa-views')
var Router = require('koa-router');
var flash = require('koa-connect-flash');

var router = new Router()
var moment = require('moment')
var staticServer = require('koa-static');
var conf = require('./config/conf')

var pool = conf.pool
var p = conf.p


var models_path = __dirname + '/app/models'

var walk = function(path) {
    fs
        .readdirSync(path)
        .forEach(function(file) {
            var newPath = path + '/' + file
            var stat = fs.statSync(newPath)

            if (stat.isFile()) {
                if (/(.*)\.(js|coffee)/.test(file)) {
                    require(newPath)
                }
            }
            else if (stat.isDirectory()) {
                walk(newPath)
            }
        })
}
walk(models_path)


//视图
app.use(views(__dirname + '/app/views',{
    extension:'jade',
    locals:{
        moment:moment
    }
}))
app.use(staticServer(path.join(__dirname, 'public')));


//session
app.keys = ['some secret things add by yuan'];
app.use(session(app));
app.use(bodyParser());
app.use(flash());

// pre handle user
app.use(function *(next){
    var user = this.session.user
    if(user && user.id){
        var res = yield p.query('select id,name,password from users where id = ? limit 1',[user.id])
        this.state.user = this.session.user = res[0]
    }else{
        this.state.user = null
    }
    this.state.success = this.flash('success').toString();
    this.state.error = this.flash('error').toString();
    yield next
})

//路由
require('./config/routes')(router)
app
    .use(router.routes())
    .use(router.allowedMethods())

app.listen(3000);

console.log('Listening');

var spawn = require('child_process').spawn;
var cronJob = require('cron').CronJob;
var job = new cronJob('1 1 * * * *',function(){
    console.log('start crawler')
    //创建一个子进程
    var child = spawn(process.execPath,['./task/crawler.js']);
    //把子进程的标准输出的数据传递到主进程 的标准输出
    child.stdout.pipe(process.stdout);
    //把子进程的错误输出的数据传递到主进程的错误输出
    child.stderr.pipe(process.stderr);
});
job.start();
