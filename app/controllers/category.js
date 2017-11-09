<<<<<<< HEAD
var mongoose = require('mongoose')
var Category = mongoose.model('Category')

// admin new page
exports.new = function *(next) {
  this.render('pages/category_admin', {
    title: 'imooc 后台分类录入页',
    category: {}
  })
}

// admin post movie
exports.save = function *(next) {
  var _category = this.request.body.category
  var category = new Category(_category)

  yield category.save()
  this.redirect('/admin/category/list')

}

// catelist page
exports.list = function *(next) {
  var catetories = yield Category.fetch()
  yield this.render('pages/categorylist', {
    title: 'movie 分类列表页',
    catetories: catetories
  })
=======
var mongoose = require('mongoose')
var Category = mongoose.model('Category')

// admin new page
exports.new = function *(next) {
  this.render('pages/category_admin', {
    title: 'imooc 后台分类录入页',
    category: {}
  })
}

// admin post movie
exports.save = function *(next) {
  var _category = this.request.body.category
  var category = new Category(_category)

  yield category.save()
  this.redirect('/admin/category/list')

}

// catelist page
exports.list = function *(next) {
  var catetories = yield Category.fetch()
  yield this.render('pages/categorylist', {
    title: 'movie 分类列表页',
    catetories: catetories
  })
>>>>>>> 0d3ea3112a579e19f29e07586fa6906c63c92ef5
}