


var ws = require("nodejs-websocket")

var port =3000

var userCount=0
// Scream server example: "hi" -> "HI!!!"
//这个主要是配置服务器的
//首先声明一个服务器，是通过ws.createServer 回调函数就是服务器的工作内容
var server = ws.createServer(function (conn) {
	//conn就是建立的服务器连接
	console.log("New connection")
	userCount++
	conn.nikeName="user"+userCount
	var mes={}
	mes.type="enter"
	mes.data=conn.nikeName+"进入聊天室"	
	broadcast(JSON.stringify(mes));
	//监听事件：收到消息的时候
	conn.on("text", function (str) {
		console.log("收到消息 "+str)
		var mes={}
		mes.type="message"
		mes.data=conn.nikeName+":"+str
		broadcast(JSON.stringify(mes));
	})
	//监听事件：窗口关闭连接的时候
	conn.on("close", function (code, reason) {
		console.log("Connection closed")
		var mes={}
		mes.type="left"
		mes.data=conn.nikeName+"离开"
		broadcast(JSON.stringify(mes));
	})
	//监听事件：发生错误的时候
	conn.on("error",function(err){
		console.log("handle error");
		console.log(err);
	})
}).listen(port)

console.log("websocket server listening on port"+port);

function broadcast(str){
	//connections是当前所有的链接
	server.connections.forEach(function(connection){
		//sendText  这个是发送消息的方法
		connection.sendText(str);
	})
}
