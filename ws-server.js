'use strict'
const WebSocketServer = require('ws').Server,
    wss = new WebSocketServer({
        port: 4545
    })

let wordArr = ['asd','qwe','rrr','eee']
var keyWord = '等待开始！'
wss.on('connection', function (ws) {
    console.log('connected.')
    
/*     let keyWord = ((arr) => {
        let num = Math.floor(Math.random() * arr.length)
        return arr[num]
    })(wordArr) */

    ws.on('message', function (message) {
        /* console.log('received: %s', message) */
        let messages = message.split(":")
        /* console.log(messages[1]) */
        if (messages[0] == keyWord) {
            console.log('correct')
            wss.clients.forEach((client) => {
                client.send(messages[1]+"@right")
                console.log(messages[1]+"@right")
            })
        }else if (messages[0] == 'nw'){ //newword:花花
            console.log(messages[1])
            keyWord = messages[1]
            console.log(keyWord)
            wss.clients.forEach((client) => {
                client.send('keyword:' + keyWord)
            })

        } 
        else if (messages[0] == 'id'){ //idea@提示1
            console.log(messages[1])
            keyWord = messages[1]
            console.log(keyWord)
            wss.clients.forEach((client) => {
                client.send(messages[1]+"@idea")
                console.log(messages[1]+"@idea")
            })

        } 
        else if (message == 'wait'){ //wait
            console.log('wait')
            keyWord = "请等待开始，准备好了就在绘图板上画一个ok"
            wss.clients.forEach((client) => {""
                client.send('keyword:' + keyWord)
            })
        }else if (message == 'cell'){ //cell
            console.log('隐藏')
            wss.clients.forEach((client) => {
                client.send('cell@cell')
            })
        }else if (message == 'timeLast'){ //
            console.log('时间10s')
            wss.clients.forEach((client) => {
                client.send('time@Last')
            })
        }else if (message == 'timeend'){
            console.log('结束')
            wss.clients.forEach((client) => {
                client.send('time@end')
            })
        }else {
            console.log('wrong')
            console.log(keyWord)
            wss.clients.forEach((client) => {
                client.send(message)
            })
        }
    })

    wss.clients.forEach((client) => {
        client.send('keyword:' + keyWord)
    })
})