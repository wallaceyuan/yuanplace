var weiboLoginModule = require("./weiboLogin");
var Request = require('request');
var Promise = require('bluebird')
var request = Promise.promisify(require('request'))
var iconv = require('iconv-lite')
var cheerio = require('cheerio')
var cUrl = "http://weibo.com/aj/v6/comment/big?id="
var aaa = 'http://weibo.cn/comment/Ec2EOcu7y?uid=1845864154&rl=0#cmtfrm'
var cRequest = ''
var wUrl = 'http://weibo.cn/kankanews'

exports.readNews = function (uri,callback) {

    var options = {
        uri:wUrl,
        encoding:null,
        headers: {
            'User-Agent': 'spider'
        }
    }

    request(options).then(function(response){
        var result = iconv.decode(response.body,'utf8');
        console.log(result)
/*        fetchUserWeibo(result,function (err,weibo) {
            getComment(weibo,function (err,comment) {
                console.log('comment')
            })
        })*/
    })
}


function getComment(body,callback) {
    console.log(cUrl+body.mid)
    var options = {
        "method":"GET",
        uri:cUrl+body.mid,
        json:true
    }
    cRequest.get(options,function(err,response,body){
        console.log(body)
        //cRequest(options).then(function(response){
        //var result = iconv.decode(response.body,'utf8');
    })
}


function fetchUserWeibo(body,callback) {
    var $ = cheerio.load(body);
    var item = $("div[action-type=feed_list_item]")[0]
    callback(null,getWeibo($,item));
/*    $("div[action-type=feed_list_item]").map(function (index,item) {
        if($(item).attr("feedtype") != "top"){
            callback(null,getWeibo($,item));
        }
    })*/
}

function fetchWebContent(body,callback) {
    var $ = cheerio.load(body);
    var item = $(".c span.ctt")[0]
    callback(null,getWeibo($,item));
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

