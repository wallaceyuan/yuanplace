
$(function(){
    $('button.moviedel').on('click',function(){
        var id = $(this).attr('data-id')
        var url = '/admin/movie/list?id='+id
        delItem(url)
    })
    $('button.userdel').on('click',function(){
        var id = $(this).attr('data-id')
        var url = '/admin/user/list?id='+id
        delItem(url)
    })
    $('button.blogdel').on('click',function () {
        var id = $(this).attr('data-id')
        var url = '/admin/blog/list?id='+id
        delItem(url)
    })
    $('button.catedel').on('click',function () {
        var id = $(this).attr('data-id')
        var url = '/admin/blog/cate?id='+id
        delItem(url)
    })
})


function delItem(url){
    $.ajax({
        url: url,
        type: 'DELETE',
        success: function(response) {
            if(response.success == 1){
                window.location.reload()
            }else{
                alert('删除失败')
            }
        }
    });
}