/**
 * Created by yuan on 2016/9/21.
 */
$(function(){
    $('button.moviedel').on('click',function(){
        var id = $(this).attr('data-id')
        var url = '/admin/movie/list?id='+id
        delMovie(url)
    })
    $('button.userdel').on('click',function(){
        var id = $(this).attr('data-id')
        var url = '/admin/user/list?id='+id
        delMovie(url)
    })
})

function delMovie(url){
    $.ajax({
        url: url,
        type: 'DELETE',
        success: function(response) {
            if(response.success == 1){
                window.location.reload()
            }else{
                alert('É¾³ýÊ§°Ü')
            }
        }
    });
}