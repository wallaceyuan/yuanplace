/**
 * Created by Yuan on 2016/8/7.
 */
/**
 * Created by Yuan on 2016/8/7.
 */
'use strict'

var Wechat = require('../../wechat/wechat');
var config = require('../../config');
var util = require('../../libs/util');
var Movie = require('../api/movie')


exports.guess = function *(next) {
  var wechatApi = new Wechat(config.wechat);
  var data = yield wechatApi.fecthAccessToken();
  var access_token = data.access_token
  var ticketData = yield wechatApi.fecthTicket(access_token);
  var ticket = ticketData.ticket
  var url = this.href.replace(':8000', '');
  var params = util.sign(ticket, url);
  yield this.render('wechat/game',params);
}

exports.find = function *(next) {
  var id = this.params.id
  var wechatApi = new Wechat(config.wechat);
  var data = yield wechatApi.fecthAccessToken();
  var access_token = data.access_token
  var ticketData = yield wechatApi.fecthTicket(access_token);
  var ticket = ticketData.ticket
  var url = this.href.replace(':8000', '');

  var params = util.sign(ticket, url);
  var movie = yield Movie.searchById(id)
  console.log(movie);
  params.movie = movie
  yield this.render('wechat/movie',params);
}

exports.findName = function *(next) {
  var wechatApi = new Wechat(config.wechat);
  var data = yield wechatApi.fecthAccessToken();
  var access_token = data.access_token
  var ticketData = yield wechatApi.fecthTicket(access_token);
  var ticket = ticketData.ticket
  var url = this.href.replace(':8000', '');
  var params = util.sign(ticket, url);
  yield this.render('wechat/game',params);

/*  var id = this.params.id
  var wechatApi = new Wechat(config.wechat);
  var data = yield wechatApi.fecthAccessToken();
  var access_token = data.access_token
  var ticketData = yield wechatApi.fecthTicket(access_token);
  var ticket = ticketData.ticket
  var url = this.href.replace(':8000', '');
  var params = util.sign(ticket, url);*/
  var movies = yield Movie.searchByName(content)
  console.log(movies);
/*  params.movie = movie
  yield this.render('wechat/movie',params);*/
}
