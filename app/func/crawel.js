var Promise = require('bluebird');
var request = Promise.promisify(require('request'));
var iconv = require('iconv-lite');
var cheerio = require('cheerio');
var options = {
    url:'http://top.baidu.com/category?c=10&fr=topindex',
    encoding:null
}
request(options).then(function(response){
    var result = iconv.decode(response.body,'gbk');
    var $ = cheerio.load(result);
    $('.hd .title a').each(function(){
        var $me = $(this);
        console.log($me.text());
    });
})