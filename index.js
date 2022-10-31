var ws = require("nodejs-websocket");
var moment = require('moment');

console.log("開始連接...")
const port = process.env.PORT || 3000;
let users = [];

// 向所有连接的客户端广播
// function boardcast(obj) {
//     server.connections.forEach(function (conn) {
//         conn.sendText(JSON.stringify(obj));
//     })
// }

// function getDate() {
//     return moment().format('YYYY-MM-DD HH:mm:ss')
// }

var server = ws.createServer(function (conn) {
    conn.on("text", function (obj) {
        obj = JSON.parse(obj);
        if (obj.type === 1) {
            users.push({
                nickname: obj.nickname,
                uid: obj.uid
            });
            // boardcast({
            //     type: 1,
            //     date: getDate(),
            //     msg: obj.nickname + '加入聊天室',
            //     users: users,
            //     uid: obj.uid,
            //     nickname: obj.nickname
            // });
        } else {
            // boardcast({
            //     type: 2,
            //     date: getDate(),
            //     msg: obj.msg,
            //     uid: obj.uid,
            //     nickname: obj.nickname
            // });
        }
    })
    conn.on("close", function (code, reason) {
        console.log("關閉連接")
    });
    conn.on("error", function (code, reason) {
        console.log("啟動連接")
    });
}).listen(port)
console.log("WebSocket建立完成")