/**
 * Created by yuan on 2016/9/21.
 */
$(function(){
    $('button').on('click',function(){
        var id = $(this).attr('data-id')
        delMovie(id)
    })
})

function delMovie(id){
    console.log(id)
    $.ajax({
        url: '/admin/movie/list?id='+id,
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