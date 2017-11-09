var gulp = require('gulp');
var less = require('gulp-less')
var sass = require('gulp-sass');
var connect = require('gulp-connect');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify')
var minifyHtml = require("gulp-minify-html");
var rename = require('gulp-rename');
var minify = require('gulp-minify-css');//在文件的顶部去包含这个插件，起个名字，叫做 minify
var imagemin = require('gulp-imagemin');
var jshint = require("gulp-jshint");

gulp.task('build',['copy-html','copy-images','copy-other'],function(){
    console.log('build suceess');
})

/**
 * 匹配多个目录 glob
 * 可以填写一个数组
 *
 */

gulp.task('less',function(){
    return gulp.src('app/less/*.less').pipe(less()).pipe(gulp.dest('dist/css'))
})

gulp.task('sass',function(){
    return gulp.src('app/sass/*.scss').pipe(sass()).pipe(gulp.dest('dist/css'));
});

gulp.task('concatJs',function(){
    return gulp.src(['app/js/*.js','!app/js/*.temp.js'])
        .pipe(concat('app.js'))
        .pipe(gulp.dest('dist/js'))
        .pipe(connect.reload())
})

gulp.task('uglifyJs',function(){
    return gulp.src(['app/js/*.js','!app/js/*.temp.js'])
        .pipe(concat('app.js'))
        .pipe(uglify()) //对合并后的app.js文件进行压缩
        /*.pipe(rename('uglify.min.js'))*/
        .pipe(gulp.dest('dist/js'))
        .pipe(connect.reload())
})

gulp.task('minify-html',function(){
    return gulp.src('app/tpl/*.html')
        .pipe(minifyHtml())
        .pipe(gulp.dest('dist/tpl/html'))
})

gulp.task('uglify-rename',function(){
    return gulp.src(['app/js/*.js','!app/js/*.temp.js'])
        .pipe(concat('app.js'))
        .pipe(gulp.dest('dist/js'))
        .pipe(uglify())
        .pipe(rename('app.min.js'))
        .pipe(gulp.dest('dist/js'))
})

gulp.task('minify',function(){
    return gulp.src('app/less/*.less')//指定 less文件
        .pipe(less())//把less编译成css
        .pipe(gulp.dest('dist/css'))//输出到目的地
        .pipe(minify())//对 css再进行压缩
        .pipe(rename('page.min.css'))//重命名
        .pipe(gulp.dest('dist/css'));//输出到目的地
});

gulp.task('watch',function(){
    gulp.watch('app/tpl/index.html',['copy-html']);//当index.html文件变化时执行copy-html任务
});

gulp.task('gulp-jshint',function(){
    return gulp.src('src/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter())
});

gulp.task('server',function(){
    connect.server({
        root:'dist',//服务器的根目录
        port:8080, //服务器的地址，没有此配置项默认也是 8080
        livereload:true//启用实时刷新的功能
    });
});

//在执行watch的时候会监控index.html文件的变化，发生变化后可以执行拷贝html的任务
/*gulp.task('default',function(){
    gulp.watch('app/index.html',['copy-html']);
    gulp.watch('app/imgs/!**!/!*.{jpg,png}',['copy-images']);
    gulp.watch(['app/css/!*.css','app/js/!*.js','app/js/!*.tmp.js'],['copy-other']);
});*/

//gulp.task('default',['server','watch']);//运行此任务的时候会在8080上启动服务器
//gulp.task('default',['less','sass'])

/**
 * 复制图片
 */
gulp.task('copy-images',function(){
    return gulp.src('app/images/*.{jpg,png,gif}')
        .pipe(imagemin()) //进行图片压缩
        .pipe(gulp.dest('dist/images'));
});
gulp.task('copy-html',function(){
    gulp.src('app/test2.html')
        .pipe(gulp.dest('dist'))
        .pipe(connect.reload())
})

gulp.task('copy-other',function(){
    return gulp.src(['app/css/*.css','app/js/*.js'],{base:'app'})
        .pipe(gulp.dest('dist'))
        .pipe(connect.reload())
})

gulp.task('c_u_css',function(){
    return gulp.src('app/css/movie.css')//指定 less文件
        .pipe(concat('index.css'))
        .pipe(gulp.dest('dist/css'))
        .pipe(connect.reload())
})

gulp.task('c_u_js',function(){
    return gulp.src(['app/js/index.js'])
        .pipe(concat('index.js'))
        .pipe(gulp.dest('dist/js'))
        .pipe(connect.reload())
})

gulp.task('default',['server','copy-html','c_u_js','c_u_css'],function(){
    gulp.watch('app/test2.html',['copy-html']);
    gulp.watch(['app/js/index.js'],['c_u_js']);
    gulp.watch('app/css/movie.css',['c_u_css']);
})