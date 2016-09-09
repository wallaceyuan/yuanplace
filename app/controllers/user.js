var mongoose = require('mongoose')
var co = require('co');
var User = mongoose.model('User')
var users = require('../api/users')
var bcrypt = require('bcryptjs')
var SALT_WORK_FACTOR = 10

// signup
exports.showSignup = function *(next) {
  yield this.render('pages/signup', {
    title: '注册页面'
  })
}

exports.showSignin = function *(next) {
  yield this.render('pages/signin', {
    title: '登录页面'
  })
}

exports.signup = function *(next) {
  var _user = this.request.body.user
  var res = yield p.query('select * from users where name=? limit 1',[_user.name])
  if (res && res.length > 0) {
    this.redirect('/signin')
    yield next
  }
  else {
    var salt = bcrypt.genSaltSync(SALT_WORK_FACTOR);
    var hash = bcrypt.hashSync(_user.password, salt);
    _user.password = hash
   // var aaa = yield users.preSave(_user)
    console.log(_user)
    var newUser = yield users.saveUser(_user)
    console.log(newUser)
    this.session.user = newUser
    console.log(this.session,'session')
    console.log(1233)
    this.redirect('/')
  }
}


// signin
exports.signin = function *(next) {
  var _user = this.request.body.user
  var name = _user.name
  var password = _user.password

  var user  = yield User.findOne({name: name})

  if (!user) {
    this.redirect('/signup')

    return next
  }

  var isMatch = yield user.comparePassword(password,user.password)

  if (isMatch) {
    this.session.user = user
    return this.redirect('/')
    yield next
  }
  else {
    return this.redirect('/signin')
    yield next
  }
}

// logout
exports.logout =  function *(next) {
  delete this.session.user
  //delete app.locals.user

  this.redirect('/')
}

// userlist page
exports.list = function *(next) {
  var users = yield  User.find({}).sort('meta.updateAt').exec()
  yield this.render('pages/userlist', {
    title: 'imooc 用户列表页',
    users: users
  })
}

// midware for user
exports.signinRequired = function *(next) {
  var user = this.session.user
  if (!user) {
    this.redirect('/signin')
  }else{
    yield next
  }
}

exports.adminRequired = function *(next) {
  var user = this.session.user
  if (user.role <= 10) {
    this.redirect('/signin')
  }else{
    yield next
  }
}