exports.index = function *(next) {
    yield this.render('pages/api/index', {
        title : 'api',
    })
}
exports.test = function *(next) {
    yield this.render('pages/api/test', {
        title : 'api',
    })
}