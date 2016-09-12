'use strict';

var mongoose = require('mongoose');
var Movie = mongoose.model('Movie');
var Category = mongoose.model('Category');
var koa_request = require('koa-request');
var Promise = require('bluebird');
var request = Promise.promisify(require('request'));
var _ = require('lodash');
var co = require('co');
var bcrypt = require('bcryptjs');
var SALT_WORK_FACTOR = 10;

var conf = require('../../config/conf');
var pool = conf.pool;
var p = conf.p;

exports.preSave = function* (_user) {
    bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
        if (err) return next(err);
        bcrypt.hash(_user.password, salt, function (err, hash) {
            if (err) return next(err);
            _user.password = hash;
            return _user;
        });
    });
};

exports.saveUser = function* (_user, _this) {
    var user = _user;
    var res = p.query('select id from users where name = ? limit 1', [user.name]);
    if (res && res.length > 0) {
        yield p.query('update users set updateAt = ? where name = ?', [new Date(), user.name]);
    } else {
        var res = yield p.query('insert into users(name,password,createAt,updateAt) value(?,?,?,?)', [user.name, user.password, new Date(), new Date()]);
        var newUser = {
            id: res.insertId,
            name: user.name
        };
        return newUser;
    }
};

//# sourceMappingURL=users-compiled.js.map