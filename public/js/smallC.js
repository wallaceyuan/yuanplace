function getComment(parma,url) {
    var url = url
    var id = $(parma).attr('data')
    var _that = parma
    if (id) {
        $.ajax({
            url: url + id,
            type: 'get',
            success: function (data) {
                var tmp = ''
                data = JSON.parse(data)
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
                                                ${dd.content}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                `
                })
                tmp += `
                        <a bpfilter="page_frame" href="http://127.0.0.1:3000/crawler/content/${id}" class="WB_cardmore S_txt1 S_line1 clearfix"><span class="more_txt">点击查看更多评论></span></a>
                        `
                var nextDom = $(_that).parent('.WB_row_line').next()
                nextDom.css('display','block').find('.repeat_list').html(tmp)
            },
            error:function (err) {
                console.log(err)
            }
        })
    }
}

$(function () {
    $('.comments.small').on('click',function () {
        var cur = $(this).attr('cur')
        console.log(cur)
        cur?$(this).removeAttr('cur'):$(this).attr('cur','cur')
        cur?$(this).parent('.WB_row_line').next().css('display','none').find('.repeat_list').html(''):getComment(this,'http://127.0.0.1:3000/crawler/small/')
    });
})