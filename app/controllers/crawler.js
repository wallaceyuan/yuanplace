
var crawler = require('../api/crawler')

exports.index = function *(next) {
    var page = parseInt(this.query.p, 10) || 1
    page = page?page:1

    var count = 10
    var sql = 'select * from kweibo order by sendAt desc limit '+(page-1) * count+','+count

    var crawlists = yield p.query(sql)
    var total = yield p.query('select count(*) as count from kweibo')
    total = total[0].count
    //console.log(crawlists)
    yield this.render('pages/crawler', {
        totalPage: Math.ceil(total / count),
        title: 'crawler',
        crawlists: crawlists,
        currentPage: page
    })
}


exports.commentS = function *(next) {
    var mid = this.params.mid
    if (mid) {
        var coments = yield p.query('select * from kweibo_c where news_id = ? limit 0,10',[mid])
        coments.map(function (com) {
            com.content = unescape(com.content)
        })
        var json = JSON.stringify(coments)
        this.body = json

    }else{
        var json = "{\"err_code\":200,\"err_message\":\"Wrong \"}";
        this.body = json
    }
}
exports.content = function *(next) {
    var mid = this.params.mid
    var sql = 'select * from kweibo where mid = ?'
    var content = yield p.query(sql,[mid])
    yield this.render('pages/crawContent', {
        title: 'content',
        content: content[0],
    })
}