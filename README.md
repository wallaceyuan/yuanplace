<<<<<<< HEAD
# wechat
������Ϣ


var content = yield util.parseXMLAsync(data);//data to xml

<xml><ToUserName><![CDATA[gh_4e7f68d8fcc7]]></ToUserName>
<FromUserName><![CDATA[o82rWwLSOmHGWDKL4ZQA8fSceGKQ]]></FromUserName>
<CreateTime>1469170565</CreateTime>
<MsgType><![CDATA[text]]></MsgType>
<Content><![CDATA[1]]></Content>
<MsgId>6310039529339247464</MsgId>
</xml>


var message = util.formatMessage(content.xml);//xml to json

{ ToUserName: 'gh_4e7f68d8fcc7',
  FromUserName: 'o82rWwLSOmHGWDKL4ZQA8fSceGKQ',
  CreateTime: '1469170565',
  MsgType: 'text',
  Content: '1',
  MsgId: '6310039529339247464' }


this.weixin = message;

yield handler.call(this,next);//weixin.reply
����message.Event || message.MsgType ���� this.body


wechat.replay.call(this);
//����content message ���ض�Ӧ��xml



var content = this.body
var message = this.weixin

console.log('message',message);

var xml = util.tpl(content,message);//content �������������صĶ�Ӧ����
                                      messgae ����΢�ŷŷ����Ķ�Ӧ�û�������Ϣ

this.status = 200
this.type = 'application/xml'
this.body = xml

=======
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

#### 单元测试
npm run test 进行mocha自动化测试
>>>>>>> 0d3ea3112a579e19f29e07586fa6906c63c92ef5
