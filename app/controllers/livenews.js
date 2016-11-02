
exports.index = function *(next) {
    yield this.render('pages/livenews', {
        title: 'livenews'
    })
}

exports.page = function *(next) {
    yield this.render('pages/livepages', {
        title: 'livepages'
    })
}