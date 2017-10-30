'use strict'

var koa_request = require('koa-request')
var Promise = require('bluebird');
var request = Promise.promisify(require('request'));
var _ = require('lodash');
var co = require('co');
var conf = require('../../config/conf')
var pool = conf.pool
var p = conf.p
