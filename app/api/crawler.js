'use strict'
var conf = require('../../config/conf')
var util = require('../../libs/util')
var p = conf.p
var photo = conf.photo

exports.index = function *(page) {
    var count = 10
    var sql = 'select * from kweibo order by sendAt desc limit '+(page-1) * count+','+count
    var crawlists = yield p.query(sql)
    var total = yield p.query('select count(*) as count from kweibo')
    var total = total[0].count
    var navtmp =  util.pageIndex(page,Math.ceil(total/count),'crawler')
    return {
        "crawlists" : crawlists,
        "navtmp"    : navtmp
    }
}

exports.index_v2 = function *(page) {
    var count = 10
    var sql = 'select * from kweibo order by sendAt desc limit '+(page-1) * count+','+count
    var crawlists = yield p.query(sql)
    var total = yield p.query('select count(*) as count from kweibo')
    var total = total[0].count
    var navtmp =  util.pageIndex(page,Math.ceil(total/count),'crawler')
    return {
        "crawlists" : crawlists,
        "navtmp"    : navtmp
    }
}

exports.commentS = function *(mid) {
    var coments = yield p.query('select * from kweibo_c where news_id = ? limit 0,10',[mid])
    coments.map(function (com) {
        com.content = unescape(com.content)
    })
    var json = JSON.stringify(coments)
    return json
}

exports.commentS_v2 = function *(mid) {
    var coments = yield p.query('select * from p_weibo where mid = ? limit 0,10',[mid])
    coments.map(function (com) {
        com.content = unescape(com.content)
    })
    var json = JSON.stringify(coments)
    return json
}

exports.commentB = function *(count,page,id) {

    var sql = 'select * from kweibo_c where news_id = ? order by id desc limit '+(page-1) * count+','+count

    var data = yield p.query(sql,[id])
    var total = yield p.query('select count(*) as count from kweibo_c where news_id = ?',[id])
    total = total[0].count

    var tmp = ''
    data.map(function (dd) {
        var rep = ''
        if(dd.isReply)
            rep = `<em class="name">@${dd.name}</em>`
        tmp += `
            <div comment_id="${dd.comment_id}" class="list_li S_line1 clearfix">
                <div class="WB_face W_fl">
                    <img width="30" height="30" alt="${dd.name}" src="${dd.poster}" usercard="id=2020917841" ucardconf="type=1">
                </div>
                <div node-type="replywrap" class="list_con">
                    <div class="WB_text">
                        <span class="name">${dd.name} :</span>
                        <span class="content">
                            ${rep}
                            ${unescape(dd.content)}
                        </span>
                    </div>
                </div>
            </div>
                `
    })
    return {
        "total": total,
        "tmp"  : tmp
    }
}

exports.commentB_v2 = function *(count,page,id) {

    var sql = 'select * from p_weibo where mid = ? order by id desc limit '+(page-1) * count+','+count

    var data = yield p.query(sql,[id])
    var total = yield p.query('select count(*) as count from p_weibo where mid = ?',[id])
    total = total[0].count

    var tmp = ''
    data.map(function (dd) {
        var rep = ''
        var poster = '/images/avtor/'+Math.ceil(Math.random()*photo)+'.jpg'
        if(dd.isReply)
            rep = `<em class="name">@${dd.userName}</em>`
        tmp += `
            <div comment_id="${dd.cid}" class="list_li S_line1 clearfix">
                <div class="WB_face W_fl">
                    <img width="30" height="30" alt="${dd.userName}" src="${poster}" usercard="id=2020917841" ucardconf="type=1">
                </div>
                <div node-type="replywrap" class="list_con">
                    <div class="WB_text">
                        <span class="name">${dd.userName} :</span>
                        <span class="content">
                            ${rep}
                            ${unescape(dd.content)}
                        </span>
                    </div>
                </div>
            </div>
                `
    })
    return {
        "total": total,
        "tmp"  : tmp
    }
}