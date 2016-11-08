//var mongoose = require('mongoose')
var co = require('co');
//var User = mongoose.model('User')
var users = require('../api/users')
var bcrypt = require('bcryptjs')
var SALT_WORK_FACTOR = 10
var conf = require('../../config/conf')
var pool = conf.pool
var p = conf.p


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
    this.flash('error', '用户名已存在'); //放置失败信息
    this.redirect('/signin')
    yield next
  }
  else {
    var salt = bcrypt.genSaltSync(SALT_WORK_FACTOR);
    var hash = bcrypt.hashSync(_user.password, salt);
    _user.password = hash
    var newUser = yield users.saveUser(_user)
    this.session.user = newUser
    this.flash('success', '注册成功'); //放置失败信息
    this.redirect('/movie')
  }
}

// signin
exports.signin = function *(next) {
  var _user = this.request.body.user
  var name = _user.name
  var password = _user.password

  var res  = yield p.query('select id,name,password,role from users where name = ?',[name])
  var user = res[0]

  if (!user) {
    this.flash('error','没有这个用户，请注册')
    this.redirect('/signup')
    return next
  }

  var isMatch = yield users.comparePassword(password,user.password)

  if (isMatch) {
    this.flash('success','登录成功')
    this.session.user = user
    return this.redirect('/movie')
    yield next
  }
  else {
    this.flash('error','密码错误')
    return this.redirect('/signin')
    yield next
  }
}

// logout
exports.logout =  function *(next) {
  delete this.session.user
  this.flash('success', '登出成功'); //放置失败信息
  this.redirect('/movie')
}


// userlist page
exports.list = function *(next) {
  var users = yield p.query('select t1.id,t1.name,t1.password,t1.role,t2.name as roleName from users as t1 ,roles as t2 where t2.role_id = t1.role order by updateAt desc')
  //var users = yield  User.find({}).sort('meta.updateAt').exec()
  yield this.render('pages/userlist', {
    title: 'movie 用户列表页',
    users: users,
    type: 'admin'
  })
}

exports.del =  function *(next){
  var id = this.query.id
  if (id) {
    try{
      yield p.query('delete from users where id=?',[id])
      this.body = {success: 1}
    }catch(err){
      console.log(err)
      this.body = {success: 0}
    }
  }
}

exports.update = function *(next){
  var id = this.params.id
  if(id){
    var roles = yield p.query('select name,role_id from roles')
    var users = yield p.query('select t1.id,t1.name,t1.password,t1.role,t2.name as roleName from users as t1 ,roles as t2 where t2.role_id = t1.role and t1.id = ?',[id])
    yield this.render('pages/userupdate',{
      title: 'imooc 用户列表页',
      users: users[0],
      roles: roles,
      type: 'admin'
    })
  }
}

exports.save = function *(next){

  var userObj = this.request.body.fields || {}

  var id = userObj.id

  if (id) {

    yield p.query("UPDATE users SET name = ?,role=? where id=?",[userObj.name,userObj.inputRole,id])

  }else{

  }

  this.redirect('/admin/user/list')

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