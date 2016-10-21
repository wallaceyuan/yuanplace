var Promise = require('bluebird')
var request = Promise.promisify(require('request'))
var iconv = require('iconv-lite')
var cheerio = require('cheerio')
var async = require('async');
var cBU = 'http://weibo.com/aj/v6/comment/big?ajwvr=6&id='


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

exports.kCommentCom = function(obj,cb){
    console.log(obj)
    var kComment = []
    var url = cBU+obj.kn.mid+"&filter=0"
    var request = obj.request
    request.get({url:url},function(err,response,body){
        var data = JSON.parse(body)
        var htmlT = data.data.html
        var $ = cheerio.load(htmlT);
        $("div.list_li").map(function (index,item) {
            var comDiv = $(item)
            var content = comDiv.find('.WB_text').text().trim()
            var arr = content.split('：')
            var repName = '',content = arr[1],isReply = ''
            if(arr[1].match(/回复@/)){
                repName = arr[1].match(/@(.+?):/i)[1]
                content = arr[1].match(/:(.+?)$/i)?arr[1].match(/:(.+?)$/i)[1]:""
                isReply = 1
            }
            var comInfo = {
                "poster":comDiv.find('.WB_face img').attr('src'),
                "news_id":obj.kn.mid,
                "comment_id":comDiv.attr("comment_id"),
                "name":comDiv.find('.WB_text').find('a').eq(0).text().trim(),
                "isReply":isReply,
                "repName":repName,
                "content":content,
            }
            kComment.push(comInfo)
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

