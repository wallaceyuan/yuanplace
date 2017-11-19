/**
 * Created by yuanyuan on 2017/11/19.
 */
var cheerio = require('cheerio')
var $ = cheerio.load('<h1 class="title"> Hello</h1>')
$('h1.title').text('hello mmall')
$('h1.title').addClass('welcome')
console.log($.html())