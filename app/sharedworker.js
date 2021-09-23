/**
 * Array to store all the connected ports in.
 */
 const connectedPorts = [];

 // Create socket instance.
 const socket = new WebSocket("wss://v2api.coinflex.com/v2/websocket");
 console.log("websocket connection is created" , socket);
 if (socket==null){
    console.log("socket is null");
 }else{
     console.log("socket is not null");
 }

 // Send initial package on open.
 socket.addEventListener('open', () => {
   const m = JSON.stringify({
	"op": "subscribe", 
	"tag": 1,
	"args": ["market:FLEX-USD"]
  });
  console.log("sokcet is subscribing to the market : TODO " ,m);
   socket.send(m);
 });
 
 // Send data from socket to all open tabs.
 socket.addEventListener('message', ({ data }) => {
   const r = JSON.parse(data);
   console.log("worker is posting the received message from socket listener:" , r );
   connectedPorts.forEach(port => port.postMessage(r));
 });
 
 /**
  * When a new thread is connected to the shared worker,
  * start listening for messages from the new thread.
  */
  socket.addEventListener('connect', ({ ports }) => {
    console.log("connection event is called;");
   const port = ports[0];
 
   // Add this new port to the list of connected ports.
   connectedPorts.push(port);
   console.log("new port added");
 });