/**
 * Created by yuanyuan on 2017/11/19.
 */

var child_process = require('child_process')
var spawn = child_process.spawn;
//执行一个命令,开启一个子进程
var curl = spawn('curl',['http://www.baidu.com'])
//标准输出
curl.stdout.on('data',function (data) {
    console.log(data.toString())//buffer toString
})