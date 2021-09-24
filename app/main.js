
//Constant Values
const baseCcy1 = window.document.getElementById('baseCcy1');
const quoteCcy1 = window.document.getElementById('quoteCcy1');
const quoteCcy2 = window.document.getElementById('quoteCcy2');
const baseCcy2 = window.document.getElementById('baseCcy2');
const baseCcy3 = window.document.getElementById('baseCcy3');
const quoteCcy3 = window.document.getElementById('quoteCcy3');

baseCcy1.innerText = "BTC";
quoteCcy1.innerText = "USD";
baseCcy2.innerText = "AXS";
quoteCcy2.innerText = "USD";
baseCcy3.innerText = "MKR";
quoteCcy3.innerText = "USD";


//Constant Price Ticker Elements that will change
const podBid1 = window.document.getElementById('podBid1');
const podBid11 = window.document.getElementById('podBid11');
const podAsk1 = window.document.getElementById('podAsk1');
const podAsk11 = window.document.getElementById('podAsk11');
const curPrice1 = window.document.getElementById('curPrice1');
const curPrice11 = window.document.getElementById('curPrice11');

const podBid2 = window.document.getElementById('podBid2');
const podBid22 = window.document.getElementById('podBid22');
const podAsk2 = window.document.getElementById('podAsk2');
const podAsk22 = window.document.getElementById('podAsk22');
const curPrice2 = window.document.getElementById('curPrice2');
const curPrice22 = window.document.getElementById('curPrice22');

const podBid3 = window.document.getElementById('podBid3');
const podBid33 = window.document.getElementById('podBid33');
const podAsk3 = window.document.getElementById('podAsk3');
const podAsk33 = window.document.getElementById('podAsk33');
const curPrice3 = window.document.getElementById('curPrice3');
const curPrice33 = window.document.getElementById('curPrice33');
const msgs = window.document.getElementById('messages');


let start, previousTimeStamp;
var WorkerIO = null;
WorkerIO = new SharedWorker('./app/worker.js');

WorkerIO.port.onmessage = function (evt) {

  switch (evt.data.command) {
    case "start":
      console.log("worker thread started successfully");
      break;
    case "Subscription1Sent":
    case "Subscription2Sent":
    case "Subscription3Sent":
      console.log("subscribtion sent");
      break;
    case "Subscription1Sent": case "Subscription2Sent": case "Subscription3Sent":
      break;
    case "subscribed1": case "subscribed2": case "subscribed3":
      console.log(JSON.stringify(evt.data));
    case "s": case "Subscription2Sent": case "Subscription3Sent":
      break;
    case "error":
      console.error("Error occurred: ", evt);
      msgs.innerText = 'DEAD';
      break;
    case "close":
      console.log('closing called', evt);
      msgs.innerText = 'DEAD';
      msgs.className = 'dead'
      break;
    default:
      msgs.innerText = 'ALIVE';
      msgs.className = "alive";
    case "message": {
      if (evt && evt.data && evt.msg && evt.data.msg.event) {
        console.info(evt.data.msg.event.trim());
        return;
      }

      var step = (timestamp) => {
        if (start === undefined)
          start = timestamp;
        const elapsed = timestamp - start;
        if (previousTimeStamp !== timestamp) {
          const count = Math.min(0.1 * elapsed, 200);
          update(evt.data.msg.data);
        }
        if (elapsed < 1) { // Stop the animation after 2 seconds
          previousTimeStamp = timestamp
          window.requestAnimationFrame(step);
        }
      }
      window.requestAnimationFrame(step);
    }
  }

}

WorkerIO.port.onerror = function (err) {
  console.log("error occurred", err);

}

function update(c) {
  if (c === null || c === undefined || !Array.isArray(c)) {
    console.warn("no data");
    return;
  }
  
  let n = c[c.length - 1];

  if (n.base == "BTC" && n.marginCurrency == "USD") {
    podBid1.innerText = n.upperPriceBound;
    podBid11.innerText = n.lowerPriceBound;
    podAsk1.innerText = n.upperPriceBound;
    podAsk11.innerText = n.lowerPriceBound;
    curPrice1.innerText = n.lowerPriceBound;
    curPrice11.innerText = n.lowerPriceBound;
  } else
    if (n.base == "AXS" && n.marginCurrency == "USD") {
      podBid2.innerText = n.upperPriceBound;
      podBid22.innerText = n.upperPriceBound;
      podAsk2.innerText = n.upperPriceBound;
      podAsk22.innerText = n.upperPriceBound;
      curPrice2.innerText = n.lowerPriceBound;
      curPrice22.innerText = n.lowerPriceBound;
    } else
      if (n.base == "MKR" && n.marginCurrency == "USD") {
        podBid3.innerText = n.upperPriceBound;
        podBid33.innerText = n.upperPriceBound;
        podAsk3.innerText = n.upperPriceBound;
        podAsk33.innerText = n.upperPriceBound;
        curPrice3.innerText = n.lowerPriceBound;
        curPrice33.innerText = n.lowerPriceBound;
      }
}

