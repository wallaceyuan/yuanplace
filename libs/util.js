'use strict'

var fs = require('fs');
var Promise = require('bluebird');
var crypto = require('crypto');

exports.readFileAsync = function(fpath ,encode){
    console.log(fpath ,encode);
    return new Promise(function(resolve,reject){
        fs.readFile(fpath, encode,function(err,content){
            if(err) reject(err)
            else resolve(content)
        });
    });
}

exports.writeFileAsync = function(fpath ,content){
    return new Promise(function(resolve,reject){
        fs.writeFile(fpath, content,function(err,content){
            if(err) reject(err)
            else resolve()
        });
    });
}

var createNonce = function() {
    return Math.random().toString(32).substr(2, 15)
}

var createTimeStamp = function() {
    return parseInt(new Date().getTime() / 1000, 10) + ''
}

function _sign(ticket, noncestr, timestamp, url) {
    var params = [
        "jsapi_ticket=" + ticket,
        "noncestr=" + noncestr,
        "timestamp=" + timestamp,
        "url=" + url
    ]
    var str = params.sort().join("&")
    //jsapi_ticket=sM4AOVdWfPE4DxkXGEs8VMCPGGVi4C3VM0P37wVUCFvkVAy_90u5h9nbSlYy3-Sl-HhTdfl2fzFy1AOcHKP7qg&noncestr=Wm3WZYTPz0wzccnW&timestamp=1414587457&url=http://mp.weixin.qq.com?params=value
    var shasum = crypto.createHash('sha1');
    shasum.update(str);
    return shasum.digest('hex');
}

exports.sign = function(ticket, url) {
    var noncestr = createNonce()
    var timestamp = createTimeStamp()
    var signature = _sign(ticket, noncestr, timestamp, url)
    return {
        noncestr: noncestr,
        timestamp: timestamp,
        signature: signature
    }
}

exports.pageNav = function (page,total,id) {
    var preHtml = `<a class="page prev S_txt1 S_line1" href="javascript:void(0);" >
                <span action-type="feed_list_page" action-data="id=${id}&page=${page-1}">上一页</span>
        </a>`
    var nextHtml = `<a class="page prev S_txt1 S_line1" href="javascript:void(0);" >
                <span action-type="feed_list_page" action-data="id=${id}&page=${page+1}">下一页</span>
        </a>`
    var pH = page == 1?'':preHtml
    var nH = page == total?'':nextHtml
    var nav = ''
    if(total<6){
         for(var i = 0;i<total;i++){
            nav+= `
                <a action-data="id=${id}&page=${i+1}" class="page S_txt1 S_bg2" href="javascript:void(0);" action-type="feed_list_page">${i+1}</a>
                `
         }
    }else{
        if(page<6){
            console.log('tou')
            for(var i = 0;i<6;i++){
                nav+= `
                <a action-data="id=${id}&page=${i+1}" class="page S_txt1 S_bg2" href="javascript:void(0);" action-type="feed_list_page">${i+1}</a>
                `
            }
            nav += '<a href="javascript:void(0);" class="page S_txt2 page_dis">...</a>'
        }else if(page+6>total){
            console.log('wei')
            nav += `
                    <a action-data="id=${id}&page=1" class="page S_txt1 S_bg2" href="javascript:void(0);" action-type="feed_list_page">1</a>
                    <a href="javascript:void(0);" class="page S_txt2 page_dis">...</a>
                    `
            for(var i = total-6;i<total;i++){
                nav += `
                        <a action-data="id=${id}&page=${i+1}" class="page S_txt1 S_bg2" href="javascript:void(0);" action-type="feed_list_page">${i+1}</a>
                        `
            }
        }else{
            console.log('mid')
            nav += `
                    <a action-data="id=${id}&page=1" class="page S_txt1 S_bg2" href="javascript:void(0);" action-type="feed_list_page">1</a>
                    <a href="javascript:void(0);" class="page S_txt2 page_dis">...</a>
                    `
            for(var i = page-3;i<page+2;i++) {
                nav += `
                        <a action-data="id=${id}&page=${i + 1}" class="page S_txt1 S_bg2" href="javascript:void(0);" action-type="feed_list_page">${i + 1}</a>
                    `
            }
            nav += `
                    <a href="javascript:void(0);" class="page S_txt2 page_dis">...</a>
                    <a action-data="id=${id}&page=${total}" class="page S_txt1 S_bg2" href="javascript:void(0);" action-type="feed_list_page">${total}</a>
                    `
        }
    }

    var nav = `<div class="WB_cardpage S_line1"><div class="W_pages clearfix">${pH+nav+nH}</div></div>`
    return nav
}


exports.pageIndex = function (page,total,route) {
    console.log('page',page)
    var preHtml = `<a class="page prev S_txt1 S_line1" href="/${route}?p=${page-1}">上一页</a>`
    var nextHtml = `<a class="page prev S_txt1 S_line1" href="/${route}?p=${page+1}">下一页</a>`
    var pH = page == 1?'':preHtml
    var nH = page == total?'':nextHtml
    var nav = ''
    if(total<6){
        for(var i = 0;i<total;i++){
            nav+= `
                <a class="page S_txt1 S_bg2" href="/${route}?p=${i+1}" action-type="feed_list_page">${i+1}</a>
                `
        }
    }else{
        if(page<6){
            console.log('tou')
            for(var i = 0;i<6;i++){
                var className = i == page -1?'page S_txt1 S_bg2 current':'page S_txt1 S_bg2 '
                nav+= `
                        <a class="${className}" href="/${route}?p=${i+1}" action-type="feed_list_page">${i+1}</a>
                    `
            }
            nav += '<span class="page S_txt2 page_dis">...</span>'
        }else if(page+6>total){
            console.log('wei')
            nav += `
                    <a class="page S_txt1 S_bg2" href="/${route}?p=1" action-type="feed_list_page">1</a>
                    <span class="page S_txt2 page_dis">...</span>
                    `
            for(var i = total-6;i<total;i++){
                var className = i == page -1?'page S_txt1 S_bg2 current':'page S_txt1 S_bg2 '
                nav += `
                        <a class="${className}" href="/${route}?p=${i+1}" action-type="feed_list_page">${i+1}</a>
                        `
            }
        }else{
            console.log('mid',total)
            nav += `
                    <a class="page S_txt1 S_bg2" href="/${route}?p=1" action-type="feed_list_page">1</a>
                    <span class="page S_txt2 page_dis">...</span>
                    `
            for(var i = page-3;i<page+2;i++) {
                var className = i == page -1?'page S_txt1 S_bg2 current':'page S_txt1 S_bg2 '
                nav += `
                        <a class="${className}" href="/${route}?p=${i+1}" action-type="feed_list_page">${i + 1}</a>
                    `
            }
            nav += `
                    <span class="page S_txt2 page_dis">...</span>
                    <a class="page S_txt1 S_bg2" href="/${route}?p=${total}" action-type="feed_list_page total">${total}</a>
                    `
        }
    }

    var navPage = `<div class="WB_cardpage S_line1"><div class="W_pages clearfix">${pH+nav+nH}</div></div>`
    return navPage
}