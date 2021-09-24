(function () {
let ws = null;
const serverurl = "wss://v2api.coinflex.com/v2/websocket";
let port=null;

let cl = (event) => {
  let onClose_response = {
    'command': 'close',
    'msg': 'WebSocket Closed'
  };
  postMessage(onClose_response);
};

 
  self.addEventListener('onopen', (e) => {
    console.log('init open');

    let onOpen_response = {
      'command': 'connect',
      'msg': 'Connected'
    };
    ws.send(serverurl);
    postMessage(onOpen_response);
  });


  
  self.addEventListener('onmessage', (event) => {
    console.log(e);
    let incomingdata = JSON.parse(event.data.toString());
    let messageResponse = {
      'command': 'message',
      'msg': incomingdata
    };
    postMessage(messageResponse);
  }, false);
  self.addEventListener('onclose', () => {
    ws.close();
    var disconnect_response = {
      'command': 'disconnect',
      'msg': 'Disconnected'
    };
    postMessage(disconnect_response);
  });
  self.addEventListener('onerror', (event) => {
    let onError_response = {
      'command': 'error',
      'msg': event
    };
    self.postMessage(onError_response);
  });


  ws = new WebSocket(serverurl); 
  
  console.log('created ws obbject');
})();