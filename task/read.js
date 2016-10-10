var Request = require('request');
var Promise = require('bluebird')
var request = Promise.promisify(require('request'))
var iconv = require('iconv-lite')
var cheerio = require('cheerio')
var cUrl = "http://weibo.com/aj/v6/comment/big?id="
var async = require('async');
var kComments = [];

exports.kNews = function (uri,callback) {
    var options = {
        uri:uri,
        encoding:null,
        headers: {
            'User-Agent': 'spider'
        }
    }
    request(options).then(function(response){
        var kNews = [];
        var result = iconv.decode(response.body,'utf8');
        fetchWebContent(result,function (err,weibo) {
            kNews.push(weibo)
        })
        callback(null,kNews);
    })
}

exports.kComment = function (kn,cb) {
    var kComment = []
    var options = {
        "method":"GET",
        uri:kn.cLink,
        encoding:null,
        headers: {
            'User-Agent': 'spider'
        }
    }
    request(options).then(function(response){
        var result = iconv.decode(response.body,'utf8');
        var $ = cheerio.load(result);
        $(".c").map(function (index,item) {
            var id = $(item).attr("id")
            if(id && id.match(/C_/)){
                var cInfo = {
                    "mid":kn.mid,
                    "userName":$(item).find("a").eq(0).text(),
                    "content":$(item).find(".ctt").text()
                }
                kComment.push(cInfo)
            }
        })
        cb(null,kComment)
    })
}

function fetchWebContent(body,cb) {
    var $ = cheerio.load(body);
    $(".c").map(function (index,item) {
        if($(item).attr("id")){
            cb(null,getWeiboC($,item))
        }
    })
}

function getWeiboC($,feedSelector){
    var weiboDiv = $(feedSelector);
    var weiboInfo = {
        "text":weiboDiv.find('.ctt').text().trim(),
        "mid":weiboDiv.attr('id'),
        "cLink":weiboDiv.find('.cc').attr('href')
    }
    return weiboInfo;
}

function getWeibo($,feedSelector){
    var weiboDiv = $(feedSelector);
    var webUrl = 'http://weibo.com'

    var weiboInfo = {
        "tbinfo":  weiboDiv.attr("tbinfo"),
        "mid": weiboDiv.attr("mid"),
        "isforward":weiboDiv.attr("isforward"),
        "minfo":weiboDiv.attr("minfo"),
        "omid":weiboDiv.attr("omid"),
        "text":weiboDiv.find(".WB_detail>.WB_text").text().trim(),
        'link':webUrl.concat(weiboDiv.find(".WB_detail>.WB_from a").eq(0).attr("href")) ,
        "sendAt":new Date(parseInt(weiboDiv.find(".WB_detail>.WB_from a").eq(0).attr("date")))
    };

    if(weiboInfo.isforward){
        var forward = weiboDiv.find("div[node-type=feed_list_forwardContent]");

        if(forward.length > 0){
            var forwardUser = forward.find("a[node-type=feed_list_originNick]");

            var userCard = forwardUser.attr("usercard");

            weiboInfo.forward = {
                name:forwardUser.attr("nick-name"),
                id:userCard ? userCard.split("=")[1] : "error",
                text:forward.find(".WB_text").text().trim(),
                "sendAt":new Date(parseInt(forward.find(".WB_from a").eq(0).attr("date")))
            };
        }
    }

    return weiboInfo;
}

