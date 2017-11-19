/**
 * Created by yuanyuan on 2017/11/19.
 */
var CronJob = require('cron').CronJob

var job = new CronJob('* * * * * *',function () {
    console.log('每秒执行一次')
})

job.start();