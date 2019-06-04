
var express = require('express');
var app = express();
var http = require("http");
var WXBizDataCrypt = require('./WXBizDataCrypt');
var request = require('request');

var appid = 'wx96f51f3039a0348a';
var secret = '6ba1e4e9560cc4e4e7e7d9f29baa444d';
var data = ''

app.get('/code2Session', function (req, res) {
	// var opt = {
	// 	hostname: 'api.weixin.qq.com',
	// 	method:'GET',
	// 	path:`/sns/jscode2session?appid=${appid}&js_code=${req.query.code}&secret=${secret}&grant_type=authorization_code`,
	// }
	// var requ = http.request(opt, function(res) {
	// 	console.log("response: " + res.session_key,res.errcode);
	// 	res.on('data',function(data){
	// 		console.log(data)
	// 		data = data
	// 	}).on('end', function(){
	// 	});
	// }).on('error', function(e) {
	// 	console.log("error: " + e.message);
	// })
	// requ.write(data);
	// requ.end();
	console.log('相应结构数据',res)
	var encryptedData = JSON.stringify(req.query.encryptedData);
	console.log('加密数据字符串',encryptedData);
	var iv = JSON.stringify(req.query.iv);
	var url = `https://api.weixin.qq.com/sns/jscode2session?appid=${appid}&js_code=${req.query.code}&secret=${secret}&grant_type=authorization_code`
	request(url,function(error,response,body){
		if(!error && response.statusCode == 200){
          	//输出返回的内容
          	console.log(body);
          	data = JSON.parse(body);
          	console.log(data);
          	var pc = new WXBizDataCrypt(appid, data.session_key);
          	data = pc.decryptData(encryptedData,iv);
  			res.end(JSON.stringify(data));
      	}
  	});
})

var server = app.listen(8081, function () {

	var host = server.address().address
	var port = server.address().port

	console.log(`应用实例，访问地址为 http://${host}:${port}`)

})