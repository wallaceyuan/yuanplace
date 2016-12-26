
exports.index = function *(next) {
    yield this.render('pages/blog/index', {
        title : 'api',
    })
}