
'use strict'

exports.list = function *() {
    var list = yield p.query('select * from movie where id=? limit 1',[id])
}