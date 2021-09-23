// Create shared worker.
const webSocketWorker = new SharedWorker('sharedworker.js');
console.log("shared worker is: "  , webSocketWorker);
console.log("the current port number of the shared worker is: "  , webSocketWorker.port);

/**
 * Sends a message to the worker and passes that to the Web Socket.
 * @param {any} message 
 */
const sendMessageToSocket = message => {
  webSocketWorker.port.postMessage({ 
    action: 'send', 
    value: message,
  });

  console.log("Worker method received a send message and sending a message to websocket : ", message);
};


// Event to listen for incoming data from the worker and update the DOM.
webSocketWorker.port.addEventListener('send', ({ data }) => {
   
     console.log("Subscribing to the websocket the port after first update ");
  });

// Event to listen for incoming data from the worker and update the DOM.
webSocketWorker.port.addEventListener('message', ({ data }) => {
  requestAnimationFrame(() => {
   // appendGatePublicTickersData(data);
   console.log("provision to update the DOM is called: "+data);
   webSocketWorker.port.close();
   console.log("closing the port after first update ");
  });
});

//Worker is about to start the websocket connection 
console.log("worker is about to initialize a port connection");
// Initialize the port connection.
webSocketWorker.port.start();
console.log("connection started");


console.log("worker is about to send a mesage");

// Remove the current worker port from the connected ports list.
// This way your connectedPorts list stays true to the actual connected ports, 
// as they array won't get automatically updated when a port is disconnected.
window.addEventListener('beforeunload', () => {
    console.log("unload message is called");

  webSocketWorker.port.postMessage({ 
    action: 'unload', 
    value: null,
  });

  console.log("worker is close");
  webSocketWorker.port.close();
});

sendMessageToSocket();