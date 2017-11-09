<<<<<<< HEAD
'use strict'

var koa_request = require('koa-request')
var Promise = require('bluebird');
var request = Promise.promisify(require('request'));
var _ = require('lodash');
var co = require('co');
var conf = require('../../config/conf')
var pool = conf.pool
var p = conf.p
=======
'use strict'

var koa_request = require('koa-request')
var Promise = require('bluebird');
var request = Promise.promisify(require('request'));
var _ = require('lodash');
var co = require('co');
var conf = require('../../config/conf')
var pool = conf.pool
var p = conf.p
>>>>>>> 0d3ea3112a579e19f29e07586fa6906c63c92ef5
