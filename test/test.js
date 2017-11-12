/*karma UI测试*/
describe('jQuery', function () {
    it('should have jQuery', function () {
        if (!window.jQuery) {
            throw new Error('查看下 karma.conf.js 配置项 files 是否正确')
        }
    })
    it('should able to request https://raw.githubusercontent.com/FE-star/exercise1/master/test/test.js', function (done) {
        $.ajax({
            url: "https://raw.githubusercontent.com/FE-star/exercise1/master/test/test.js",
        })
        .done(function( data ) {
            if ( console && console.log ) {
                console.log( "Sample of data:", data );
            }
        });
    })
})
