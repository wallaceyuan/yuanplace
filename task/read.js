var Request = require('request');
var weiboLoginModule = require("./weiboLogin");

var Promise = require('bluebird')
var request = Promise.promisify(require('request'))
var iconv = require('iconv-lite')
var cheerio = require('cheerio')
var cUrl = "http://weibo.com/aj/v6/comment/big?ajwvr=6&id=4029056448434573&filter=0&__rnd=1476089815665"
var async = require('async');
var kComments = [];


/*weiboLoginModule.login("yuanfang_yff@163.com","wallace741130",function(err,cookieColl){
    if(!err){
        var request = Request.defaults({jar: cookieColl});

        request.get({url:cUrl},function(err,response,body){
            console.log(body)
        })
        var userColl = db.get("users");
        var dailyPost = db.get("dailyWeibo");

        userColl.find({},{stream:true}).each(function(doc){
            fetchUserWeibo(request,doc.uId,function(err,weibo){
                dailyPost.insert(weibo);
            });
        }).error(function(err){
            console.log(err);
        });
    }
});*/

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


exports.kNewscom = function (uri,callback) {
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
        fetchWeb(result,function (err,weibo) {
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
                var cid
                $(item).find("a").map(function(id,it){
                    var str = $(it).attr('href')
                    if(str && str.match(/reply/g)){
                        var arr = str.match(/\/([0-9]+)?/g).pop()
                        cid = arr.toString().replace(/\//,'')
                    }
                })
                var cInfo = {
                    "cid":cid,
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

function fetchWeb(body,cb) {
    var $ = cheerio.load(body);
    $("div[action-type=feed_list_item]").map(function (index,item) {
        cb(null,getWeibo($,item))
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

