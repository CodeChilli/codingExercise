var clients = [];
var ws = null;
const serverurl = "wss://v2api.coinflex.com/v2/websocket";


self.addEventListener("connect", function (evt) {
    console.log('connect is called');
    var client = evt.ports[0];
    clients.push(client);
    ws = new WebSocket(serverurl);


    ws.onopen = function () {
        let m = JSON.stringify({
            "op": "subscribe",
            "tag": 1,
            "args": ["market:BTC-USD"]
        });
        let m2 = JSON.stringify({
            "op": "subscribe",
            "tag": 2,
            "args": ["market:AXS-USD"]
        });
        let m3 = JSON.stringify({
            "op": "subscribe",
            "tag": 3,
            "args": ["market:MKR-USD"]
        });

        let onOpen_response = {
            'command': 'subscribe1',
            'msg': 'Subscription1Sent'
        };
        let onOpen_response2 = {
            'command': 'subscribe2',
            'msg': 'Subscription2Sent'
        };
        let onOpen_response3 = {
            'command': 'subscribe3',
            'msg': 'Subscription3Sent'
        };
        ws.send(m);
        client.postMessage(onOpen_response);
        ws.send(m2);
        ws.send(m3);
        client.postMessage(onOpen_response2);
        client.postMessage(onOpen_response3);
    }
    ws.onmessage = function (e) {
        const commandObj = {
            'command': 'message',
            'msg': JSON.parse(e.data)
        };
        clients.forEach(function (client) {
            client.postMessage(commandObj);
        });
    }
    ws.onclose = function (e) {
        console.log('About to close thread and websocket ');
        const commandObj = {
            'command': 'close',
            'msg': 'closed'
        };;
        clients.forEach(function (client) {
            client.postMessage(commandObj);
        });
    }
    ws.onerror = function (e) {
        console.log('websocket error' + e);
        ws.close();
        
        client.postMessage({
            'command': 'error',
            'msg': e
        });
    }
    let commandObj = {
        'command': 'start',
        'msg': 'about to start worker thread..'
    };
    client.postMessage(commandObj);
    client.start();
    
});

