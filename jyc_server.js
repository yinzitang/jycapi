
var express = require('express');
var app = express();
// var http = require("http");
var WXBizDataCrypt = require('./WXBizDataCrypt');
var request = require('request');
var fs = require('fs')

var appid = 'wx96f51f3039a0348a';
var secret = '6ba1e4e9560cc4e4e7e7d9f29baa444d';
var access = '';
var data = '';

app.get('/code2Session', function (req, res) {
	var encryptedData = JSON.stringify(req.query.encryptedData);
	// console.log('加密数据字符串',encryptedData);
	var iv = JSON.stringify(req.query.iv);
	var url = `https://api.weixin.qq.com/sns/jscode2session?appid=${appid}&secret=${secret}&js_code=${req.query.code}&grant_type=authorization_code`
	request(url,function(error,response,body){
		if(!error && response.statusCode == 200){
          	data = JSON.parse(body);
          	//console.log(data);
          	var pc = new WXBizDataCrypt(appid, data.session_key);
          	data = pc.decryptData(encryptedData,iv);
          	res.end(JSON.stringify(data));
          }
      });
});
app.get('/getAccessToken',function (req,res) {
	var url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appid}&secret=${secret}`;
	request(url,function(error,response,body){
		if(!error && response.statusCode == 200){
			access = JSON.parse(body);
			console.log(access);
			res.end();
		}
	});
})
setTimeout(function () {//获取accesstoken
	app.get('/getAccessToken',function (req,res) {
		var url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appid}&secret=${secret}`;
		request(url,function(error,response,body){
			if(!error && response.statusCode == 200){
				access = JSON.parse(body);
				console.log(access);
				res.end();
			}
		});
	})
},5000);
setInterval(function () {//两小时后获取最新的accesstoken
	app.get('/getAccessToken',function (req,res) {
		var url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appid}&secret=${secret}`;
		request(url,function(error,response,body){
			if(!error && response.statusCode == 200){
				access = JSON.parse(body);
				console.log(access);
				res.end();
			}
		});
	})
},70000);
app.get('/createwxaqrcode',function (req,res) {
	var url = `https://api.weixin.qq.com/cgi-bin/wxaapp/createwxaqrcode?access_token=${access.access_token}`
	request({
		url,
		method: "POST",
		json: true,
		headers: {
			"content-type": "application/json",
		},
		body: {"path": "pages/my/my","widht":"430"}
		},function(error,response,body){
		if(!error && response.statusCode == 200){
			access = body;
			console.log('成功');
			res.end();
		}
	}).pipe(fs.createWriteStream('123.png'))
})
app.use('/img', express.static('img'));
app.get('/index.html',function (req,res) {
	fs.readFile('E:/2019/05/jycapi/index.html', function (err, data) {
		         if (err) {
		            res.writeHeader(404, {'content-type': 'text/html;charset="utf-8"'});
		            res.write('<h1>404错误</h1><p>你要找的页面不存在</p>');
		            res.end();
		
		        } else {
		            res.writeHeader(200, {'content-type': 'text/html;charset="utf-8"'});
		            // res.write(data);
		            res.end(data);
				}
		    });
})


var server = app.listen(8081, function (req,res) {

	var host = server.address().address
	var port = server.address().port

	console.log(`应用实例，访问地址为 http://${host}:${port}`)

})