<<<<<<< HEAD
# wechat
接受消息


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
根据message.Event || message.MsgType 返回 this.body


wechat.replay.call(this);
//根据content message 返回对应的xml



var content = this.body
var message = this.weixin

console.log('message',message);

var xml = util.tpl(content,message);//content ——服务器返回的对应内容
                                      messgae ——微信放发来的对应用户操作信息

this.status = 200
this.type = 'application/xml'
this.body = xml

=======
#### 浣跨敤鏂规硶

```
https://github.com/wallaceyuan/yuanplace.git
cd yuanplace
npm install
npm run app
```

#### 閮ㄧ讲鏂规硶
1. 瀹夎mysql鏁版嵁搴撱�佹柊寤烘暟鎹簱鍜岃〃
2. 閰嶇疆椤圭洰鏈嶅姟鍣�

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
鎵撳紑
http://127.0.0.1:3000/

#### 鍗曞厓娴嬭瘯
npm run test 杩涜mocha鑷姩鍖栨祴璇�
>>>>>>> 0d3ea3112a579e19f29e07586fa6906c63c92ef5
