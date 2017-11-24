/**
 * Created by yuan on 2017/11/23.
 */
var request = require('request')
var cheerio = require('cheerio')
var iconv = require('iconv-lite')

var url = 'http://www.baidu.com'

var options = {
    uri:url,
    encoding:null
}

request(options, function (error, response, body) {
    console.log('error:', error); // Print the error if one occurred
    console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    console.log('body:', body); // Print the HTML for the Google homepage.

    var result = iconv.decode(body,'utf8');
    var $ = cheerio.load(result)
    console.log($('#u').html())
});