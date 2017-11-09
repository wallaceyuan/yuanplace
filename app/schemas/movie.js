<<<<<<< HEAD
var mongoose = require('mongoose')
var Schema = mongoose.Schema
var ObjectId = Schema.Types.ObjectId

var MovieSchema = new Schema({
  director: String,
  title: String,
  language: String,
  doubanId: String,
  country: String,
  summary: String,
  flash: String,
  poster: String,
  year: Number,
  coutry:String,
  genres:[String],
  pv: {
    type: Number,
    default: 0
  },
  category: {
    type: ObjectId,
    ref: 'Category'
  },
  meta: {
    createAt: {
      type: Date,
      default: Date.now()
    },
    updateAt: {
      type: Date,
      default: Date.now()
    }
  }
})

// var ObjectId = mongoose.Schema.Types.ObjectId
MovieSchema.pre('save', function(next) {
  if (this.isNew) {
    this.meta.createAt = this.meta.updateAt = Date.now()
  }
  else {
    this.meta.updateAt = Date.now()
  }

  next()
})

MovieSchema.statics = {
  fetch: function(cb) {
    return this
      .find({})
      .sort('meta.updateAt')
      .exec(cb)
  },
  findById: function(id, cb) {
    return this
      .findOne({_id: id})
      .exec(cb)
  }
}

=======
var mongoose = require('mongoose')
var Schema = mongoose.Schema
var ObjectId = Schema.Types.ObjectId

var MovieSchema = new Schema({
  director: String,
  title: String,
  language: String,
  doubanId: String,
  country: String,
  summary: String,
  flash: String,
  poster: String,
  year: Number,
  coutry:String,
  genres:[String],
  pv: {
    type: Number,
    default: 0
  },
  category: {
    type: ObjectId,
    ref: 'Category'
  },
  meta: {
    createAt: {
      type: Date,
      default: Date.now()
    },
    updateAt: {
      type: Date,
      default: Date.now()
    }
  }
})

// var ObjectId = mongoose.Schema.Types.ObjectId
MovieSchema.pre('save', function(next) {
  if (this.isNew) {
    this.meta.createAt = this.meta.updateAt = Date.now()
  }
  else {
    this.meta.updateAt = Date.now()
  }

  next()
})

MovieSchema.statics = {
  fetch: function(cb) {
    return this
      .find({})
      .sort('meta.updateAt')
      .exec(cb)
  },
  findById: function(id, cb) {
    return this
      .findOne({_id: id})
      .exec(cb)
  }
}

>>>>>>> 0d3ea3112a579e19f29e07586fa6906c63c92ef5
module.exports = MovieSchema