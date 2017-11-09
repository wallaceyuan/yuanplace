<<<<<<< HEAD

exports.index = function *(next) {
    yield this.render('pages/livenews', {
        title: 'livenews'
    })
}

exports.page = function *(next) {
    yield this.render('pages/livepages', {
        title: 'livepages'
    })
=======

exports.index = function *(next) {
    yield this.render('pages/livenews', {
        title: 'livenews'
    })
}

exports.page = function *(next) {
    yield this.render('pages/livepages', {
        title: 'livepages'
    })
>>>>>>> 0d3ea3112a579e19f29e07586fa6906c63c92ef5
}