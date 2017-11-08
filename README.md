#### 使用方法

```
https://github.com/wallaceyuan/yuanplace.git
cd yuanplace
npm install
npm run app
```

#### 部署方法
1. 安装mysql数据库、新建数据库和表
2. 配置项目服务器

```
var ip = 'http://127.0.0.1:3000';
var host = 'localhost';
var pool = mysql.createPool({
    host:'127.0.0.1',
    user:'root',
    password:'admin',
    database:'yuan_place',
    connectTimeout:30000
});
```
打开
http://127.0.0.1:3000/


npm run test 进行mocha自动化测试