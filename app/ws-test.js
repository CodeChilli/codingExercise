(function () {
    const messages = document.querySelector('#messages');
    const wsButton = document.querySelector('#wsButton');
    const wsSendButton = document.querySelector('#wsSendButton');
    const logout = document.querySelector('#logout');
    const login = document.querySelector('#login');

     
    function showMessage(message) {
      messages.textContent += `\n${message}`;
      messages.scrollTop = messages.scrollHeight;
      console.log(message);
    }
  
    function handleResponse(response) {
      return response.ok
        ? response.json().then((data) => JSON.stringify(data, null, 2))
        : Promise.reject(new Error('Unexpected response'));
    }
  
    login.onclick = function () {
      fetch('/login', { method: 'POST', credentials: 'same-origin' })
        .then(handleResponse)
        .then(showMessage)
        .catch(function (err) {
          showMessage(err.message);
        });
    };
  
    logout.onclick = function () {
      fetch('/logout', { method: 'DELETE', credentials: 'same-origin' })
        .then(handleResponse)
        .then(showMessage)
        .catch(function (err) {
          showMessage(err.message);
        });
    };
  
    let ws;
  
    wsButton.onclick = function () {
      if (ws) {
        ws.onerror = ws.onopen = ws.onclose = null;
        ws.close();
      }
  
      ws = new WebSocket(`wss://www.bitmex.com/realtime`); 
      ws.onerror = function () {
        showMessage('WebSocket error');
      };
      ws.onopen = function () {
        showMessage('WebSocket connection established');
      };
      ws.onclose = function () {
        showMessage('WebSocket connection closed');
        ws = null;
      };
    };
  
    wsSendButton.onclick = function () {
      if (!ws) {
        showMessage('No WebSocket connection');
        return;
      }

      const obj ={"op": "subscribe", "args": ["quote:XBTUSD"]};
      //{"op": "subscribe", "args": ["quote:ETHUSD"]}
      //{"op": "subscribe", "args": ["quote:ETHUSD"]}
      //{"op": "subscribe", "args": ["quote:XBTUSD"]}

      //HeartBeat
      //Store all the workers and start heartbeat
      const myJSON = JSON.stringify(obj);
      var buffer = new ArrayBuffer(128);
      //const myJSON2 = JSON.parse(obj);

      ws.send(JSON.stringify(obj));
      showMessage(myJSON);
    };
  })();