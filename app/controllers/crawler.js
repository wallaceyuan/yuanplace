
var Crawler = require('../api/crawler')
var util = require('../../libs/util')

exports.index    = function *(next) {
    var page = parseInt(this.query.p, 10) || 1
    page = page?page:1

    var crawler = yield Crawler.index(page)

    yield this.render('pages/crawler', {
        title       : 'crawler',
        crawlists   : crawler.crawlists,
        navtmp      : crawler.navtmp
    })

}

exports.commentS = function *(next) {
    var mid = this.params.mid
    if (mid) {
        var json = yield Crawler.commentS_v2(mid)
        this.body = json
    }else{
        var json = "{\"err_code\":200,\"err_message\":\"Wrong \"}";
        this.body = json
    }
}

exports.commentB = function *(next) {
    var query = this.query
    var id = query.id
    var page = parseInt(this.query.page, 10) || 1
        page = page?page:1
    var count = 10

    var data = yield Crawler.commentB_v2(count,page,id)

    var tmp  = data.tmp
    var re =  util.pageNav(page,Math.ceil(data.total/count),id)
    tmp += re
    var json = {
        "code":200,
        "msg": "",
        "data":{
            "html":tmp
        },
        "page":{
            "totalpage":Math.ceil(data.total/count),
            "pagenum":page
        }
    }

    this.body  = json
}

exports.content  = function *(next) {
    var mid = this.params.mid
    var sql = 'select * from kweibo where mid = ?'
    var content = yield p.query(sql,[mid])
    yield this.render('pages/crawContent', {
        title: 'content',
        content: content[0]
    })
}