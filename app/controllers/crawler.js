
// index page
exports.index = function *(next) {
    yield this.render('pages/crawler', {
        title: '爬虫',
    })
}