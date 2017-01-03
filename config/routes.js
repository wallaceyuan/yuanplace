/**
 * Created by yuan on 2016/8/10.
 */

'use strict'

var koaBody = require('koa-body')
var multer = require('koa-multer');

var Index = require('../app/controllers/index')
var User = require('../app/controllers/user')
var Movie = require('../app/controllers/movie')
var Comment = require('../app/api/comments')
var Category = require('../app/controllers/category')
var livenews = require('../app/controllers/livenews')

//wechat
var Game = require('../app/controllers/game')
var Wechat = require('../app/controllers/wechat')
var Crawler = require('../app/controllers/crawler')
//upload
var upload = require('../app/controllers/upload')
//api
var api = require('../app/controllers/api')
//wxlogin
var wxlogin = require('../app/controllers/wxlogin')


//blog
var blog = require('../app/controllers/blog')

module.exports = function(router,mupload) {

    router.get('/',Index.index)

    router.get('/wxlogin',wxlogin.index)
    router.get('/wxlogin/check',wxlogin.check)
    router.post('/wxlogin/template',wxlogin.template)

    //blog
    router.get('/blog',blog.index)
    router.get('/blog/:id',blog.index)
    router.post('/blog',koaBody({multipart:true}),blog.save)
    router.get('/blog/p/:id',blog.page)
    router.get('/blog/find/:id',blog.find)
    router.get('/admin/blog/list', User.signinRequired, User.adminRequired, blog.list)
    router.get('/admin/blog/new',User.signinRequired, User.adminRequired,blog.new)
    router.get('/admin/blog/update/:id',User.signinRequired, User.adminRequired,blog.update)
    router.get('/admin/blog/cate',User.signinRequired, User.adminRequired,blog.cate)
    router.delete('/admin/blog/list', User.signinRequired, User.adminRequired, blog.del)
    router.delete('/admin/blog/cate',User.signinRequired, User.adminRequired,blog.cate_del)
    router.put('/admin/blog/cate',User.signinRequired, User.adminRequired,blog.cate_update)

    //upload
    router.get('/api',api.index)
    router.get('/api/test',api.test)
    router.post('/api/upload',koaBody({multipart:true}),upload.qiniuUpload)

    //upload
    router.get('/upload',upload.index)
    router.post('/upload',koaBody({multipart:true}),upload.qiniuUpload)
    router.post('/upload/editor',koaBody({multipart:true}),upload.editor)

    // User
    router.post('/user/signup', User.signup)
    router.post('/user/signin', User.signin)
    router.get('/signin', User.showSignin)
    router.get('/signup', User.showSignup)
    router.get('/logout', User.logout)
    router.get('/admin/user/update/:id', User.signinRequired, User.adminRequired, User.update)
    router.get('/admin/user/list', User.signinRequired, User.adminRequired, User.list)
    router.post('/admin/user',User.adminRequired, koaBody({multipart:true}),User.save)
    router.delete('/admin/user/list', User.signinRequired, User.adminRequired, User.del)

    //movie
    router.get('/movie', Index.movie)
    router.get('/movie/list/:id', Index.more)
    router.get('/movie/:id', Movie.detail)
    router.get('/admin/movie/new', User.signinRequired, User.adminRequired, Movie.new)
    router.get('/admin/movie/update/:id', User.signinRequired, User.adminRequired, Movie.update)
    router.post('/admin/movie',User.adminRequired, koaBody({multipart:true}), Movie.savePoster,  Movie.save)
    router.get('/admin/movie/list', User.signinRequired, User.adminRequired, Movie.list)
    router.delete('/admin/movie/list', User.signinRequired, User.adminRequired, Movie.del)

    //weixin
    router.get('/wechat/movie',Game.guess)
    router.get('/wechat/movie/:id',Game.find)
    router.get('/wechat/movie/movie/:name',Game.findName)
    router.get('/wx',Wechat.hear)
    router.post('/wx',Wechat.hear)

    // Comment
    router.post('/user/comment', User.signinRequired, Comment.save)

    // Category
/*
    router.get('/admin/category/new', User.signinRequired, User.adminRequired, Category.new)
    router.post('/admin/category', User.signinRequired, User.adminRequired, Category.save)
    router.get('/admin/category/list', User.signinRequired, User.adminRequired, Category.list)
*/
    // results
    router.get('/results', Index.search)

    //weibo crawler
    router.get('/crawler', Crawler.index)
    router.get('/crawler/big',Crawler.commentB)
    router.get('/crawler/small/:mid',Crawler.commentS)
    router.get('/crawler/content/:mid',Crawler.content)

    //liveNews
    router.get('/livenews',livenews.index)
    router.get('/livepage',livenews.page)

}