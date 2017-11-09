<<<<<<< HEAD
# wechat
½ÓÊÜÏûÏ¢


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
¸ù¾İmessage.Event || message.MsgType ·µ»Ø this.body


wechat.replay.call(this);
//¸ù¾İcontent message ·µ»Ø¶ÔÓ¦µÄxml



var content = this.body
var message = this.weixin

console.log('message',message);

var xml = util.tpl(content,message);//content ¡ª¡ª·şÎñÆ÷·µ»ØµÄ¶ÔÓ¦ÄÚÈİ
                                      messgae ¡ª¡ªÎ¢ĞÅ·Å·¢À´µÄ¶ÔÓ¦ÓÃ»§²Ù×÷ĞÅÏ¢

this.status = 200
this.type = 'application/xml'
this.body = xml

=======
#### ä½¿ç”¨æ–¹æ³•

```
https://github.com/wallaceyuan/yuanplace.git
cd yuanplace
npm install
npm run app
```

#### éƒ¨ç½²æ–¹æ³•
1. å®‰è£…mysqlæ•°æ®åº“ã€æ–°å»ºæ•°æ®åº“å’Œè¡¨
2. é…ç½®é¡¹ç›®æœåŠ¡å™¨

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
æ‰“å¼€
http://127.0.0.1:3000/

#### å•å…ƒæµ‹è¯•
npm run test è¿›è¡Œmochaè‡ªåŠ¨åŒ–æµ‹è¯•
>>>>>>> 0d3ea3112a579e19f29e07586fa6906c63c92ef5
