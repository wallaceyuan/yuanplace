/**
 * Created by Yuan on 2016/6/28.
 */
'use strict';

var Koa = require('koa');
var fs = require('fs');
var app = new Koa();
var path = require('path');
var session = require('koa-session');
var mongoose = require('mongoose');
var bodyParser = require('koa-bodyparser');
var views = require('koa-views');
var Router = require('koa-router');
var router = new Router();
var moment = require('moment');
var staticServer = require('koa-static');
var conf = require('./config/conf');
var pool = conf.pool;
var p = conf.p;
// models loading
var dbUrl = 'mongodb://localhost/movie';
mongoose.connect(dbUrl);

var models_path = __dirname + '/app/models';

var walk = function (path) {
    fs.readdirSync(path).forEach(function (file) {
        var newPath = path + '/' + file;
        var stat = fs.statSync(newPath);

        if (stat.isFile()) {
            if (/(.*)\.(js|coffee)/.test(file)) {
                require(newPath);
            }
        } else if (stat.isDirectory()) {
            walk(newPath);
        }
    });
};
walk(models_path);

var User = mongoose.model('User');

//视图
app.use(views(__dirname + '/app/views', {
    extension: 'jade',
    locals: {
        moment: moment
    }
}));
app.use(staticServer(path.join(__dirname, 'public')));

//session
app.keys = ['some secret hurr'];
app.use(session(app));
app.use(bodyParser());

app.use(function* (next) {
    var user = this.session.user;
    if (user && user.id) {
        var res = yield p.query('select id,name,password from users where id = ? limit 1', [user.id]);
        this.state.user = this.session.user = res[0];
    } else {
        this.state.user = null;
    }
    yield next;
});

//路由
require('./config/routes')(router);

app.use(router.routes()).use(router.allowedMethods());

app.listen(3000);

console.log('Listening');

//# sourceMappingURL=app-compiled.js.map