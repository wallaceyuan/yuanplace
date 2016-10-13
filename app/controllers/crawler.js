
var crawler = require('../api/crawler')

exports.index = function *(next) {

    var page = parseInt(this.query.p, 10) || 1
    page = page?page:1

    var count = 10
    var sql = 'select * from kweibo limit '+(page-1) * count+','+count

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