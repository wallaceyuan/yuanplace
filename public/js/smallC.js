$(function () {
    $('.comments').on('click',function () {
        var id = $(this).attr('data')
        var _that = this
        if (id) {
            $.ajax({
                url: 'http://127.0.0.1:3000/crawler/small/' + id,
                type: 'get',
                success: function (data) {
                    var tmp = ''
                    data = JSON.parse(data)
                    data.map(function (dd) {
                        tmp += `
                                <div comment_id="${dd.comment_id}" class="list_li S_line1 clearfix">
                                    <div class="WB_face W_fl">
                                        <img width="30" height="30" alt="Mmengdier" src="${dd.poster}" usercard="id=2020917841" ucardconf="type=1">
                                    </div>
                                    <div node-type="replywrap" class="list_con">
                                        <div class="WB_text">
                                            <span class="name">${dd.name} :</span>
                                            <span class="contnet">
                                                <em class="name">@${dd.name}</em>
                                                ${dd.content}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                `
                    })
                    $(_that).parent('.WB_row_line').next().find('.repeat_list').html(tmp)
                },
                error:function (err) {
                    console.log(err)
                }
            })
        }
    });
})