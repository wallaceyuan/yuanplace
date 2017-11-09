var Movie = require('../api/movie')
var path = require('path')


//movie index page
exports.index = function *(next) {
  //var categories = yield Movie.findAll()
  yield this.render('pages/index', {
    title: '袁圆的个人网站-wallaceyuan\'s Personal Website'
    //categories: categories
  })
}


//movie index page
exports.movie = function *(next) {
  var categories = yield Movie.findAll()
  yield this.render('pages/mindex', {
    title: 'yuanMovie 首页',
    categories: categories
  })
}

exports.more = function *(next) {
  var cat = this.params.id
  var categories = yield Movie.findCates(cat)
  yield this.render('pages/movies/more',{
    cat        : cat,
    title      : 'yuanMovie',
    categories : categories
  })
}

// search page
exports.search = function *(next) {
  var catId = this.query.cat
  var q = this.query.q
  var page = parseInt(this.query.p, 10) || 0
  var count = 3
  var index = page * count

  if (catId) {
    var categories = Movie.searchByCategory(catId)
    var category = categories[0] || {}
    var movies = category.movies || []
    var results = movies.slice(index, index + count)

    yield  this.render('pages/results', {
      title: 'imooc 结果列表页面',
      keyword: category.name,
      currentPage: (page + 1),
      query: 'cat=' + catId,
      totalPage: Math.ceil(movies.length / count),
      movies: results
    })
  }
  else {
    var movies = yield Movie.searchByName(q)
    var results = movies.slice(index, index + count)
    yield this.render('pages/results', {
      title: 'imooc 结果列表页面',
      keyword: q,
      currentPage: (page + 1),
      query: 'q=' + q,
      totalPage: Math.ceil(movies.length / count),
      movies: results
    })
  }
}