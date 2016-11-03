
var crawler = require('../api/crawler')
var util = require('../../libs/util')

exports.index = function *(next) {
    var page = parseInt(this.query.p, 10) || 1
    page = page?page:1

    var count = 10
    var sql = 'select * from kweibo order by sendAt desc limit '+(page-1) * count+','+count

    var crawlists = yield p.query(sql)
    var total = yield p.query('select count(*) as count from kweibo')
    var total = total[0].count
    var navtmp =  util.pageIndex(page,Math.ceil(total/count),'crawler')

    yield this.render('pages/crawler', {
        title       : 'crawler',
        crawlists   : crawlists,
        navtmp      : navtmp
    })

}

exports.commentS = function *(next) {
    var mid = this.params.mid
    if (mid) {
        var coments = yield p.query('select * from kweibo_c where news_id = ? limit 0,10',[mid])
        coments.map(function (com) {
            com.content = unescape(com.content)
        })
        var json = JSON.stringify(coments)
        this.body = json

    }else{
        var json = "{\"err_code\":200,\"err_message\":\"Wrong \"}";
        this.body = json
    }
}

exports.commentB = function *(next){
    var query = this.query
    var id = query.id
    var page = parseInt(this.query.page, 10) || 1
    page = page?page:1

    var count = 10
    var sql = 'select * from kweibo_c where news_id = ? order by id desc limit '+(page-1) * count+','+count

    var data = yield p.query(sql,[id])
    var total = yield p.query('select count(*) as count from kweibo_c where news_id = ?',[id])
    total = total[0].count

    var tmp = ''
    data.map(function (dd) {
        var rep = ''
        if(dd.isReply)
            rep = `<em class="name">@${dd.name}</em>`
        tmp += `
            <div comment_id="${dd.comment_id}" class="list_li S_line1 clearfix">
                <div class="WB_face W_fl">
                    <img width="30" height="30" alt="${dd.name}" src="${dd.poster}" usercard="id=2020917841" ucardconf="type=1">
                </div>
                <div node-type="replywrap" class="list_con">
                    <div class="WB_text">
                        <span class="name">${dd.name} :</span>
                        <span class="content">
                            ${rep}
                            ${unescape(dd.content)}
                        </span>
                    </div>
                </div>
            </div>
                `
    })

    var re =  util.pageNav(page,Math.ceil(total/count),id)
    tmp += re
    var json = {
        "code":200,
        "msg": "",
        "data":{
            "html":tmp
        },
        "page":{
            "totalpage":Math.ceil(total/count),
            "pagenum":page
        }
    }

    this.body  = json
}

exports.content = function *(next) {
    var mid = this.params.mid
    var sql = 'select * from kweibo where mid = ?'
    var content = yield p.query(sql,[mid])
    yield this.render('pages/crawContent', {
        title: 'content',
        content: content[0]
    })
}