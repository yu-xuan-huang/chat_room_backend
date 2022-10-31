const express = require('express')
const socketServer = require('ws').Server
var moment = require('moment');

//指定port
const port = process.env.PORT || 3000;

//創建 express 的物件，並綁定及監聽 8081 port ，且設定開啟後在 console 中提示
const server = express().listen(port, () => {
    console.log(`Listening on ${port}`)
})


//將 express 交給 SocketServer 開啟 WebSocket 的服務
const socket = new socketServer({ server })

function getDate() {
    return moment().format('YYYY-MM-DD HH:mm:ss')
}

//當 WebSocket 從外部連結時執行
socket.on('connection', ws => {
    //連結時執行此 console 提示
    console.log('Client connected')
    //對 message 設定監聽，接收從 Client 發送的訊息
    ws.on('message', data => {
        data = JSON.parse(data);
        let newData;
        let users = [];
        if (data.type === 1) {
            users.push({
                nickname: data.nickname,
                uid: data.uid
            });
            newData = {
                type: 1,
                date: getDate(),
                msg: data.nickname + '加入聊天室',
                users: users,
                uid: data.uid,
                nickname: data.nickname,
                ...data
            }
        }
        else {
            newData = {
                type: 2,
                date: getDate(),
                msg: data.msg,
                uid: data.uid,
                nickname: data.nickname
            }
        }
        let clients = socket.clients
        //做迴圈，發送訊息至每個 client
        clients.forEach(client => {
            client.send(JSON.stringify(newData))
        })
    })

    //當 WebSocket 的連線關閉時執行
    ws.on('close', () => {
        console.log('Close connected')
    })
})
