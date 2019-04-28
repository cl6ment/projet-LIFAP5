/*jshint esversion: 9 */

const socket = new WebSocket('wss://lifap5.univ-lyon1.fr:443/stream/');
let heartbeat_interval = null;


socket.onopen = (event) => {
  const msg = {type : 'info', msg : "Hello server!", time: Date.now()};
  socket.send(JSON.stringify(msg));

  heartbeat_interval = setInterval(() => {
    const heartbeat = {type : 'heartbeat', time: Date.now()};
    console.log(`Sent: ${JSON.stringify(heartbeat)}`)
    socket.send(JSON.stringify(heartbeat));
  }, 30000);
};



socket.onmessage = (event) => {
  console.log(`Received: ${event.data}`);
  const item = document.createElement('li');
  item.appendChild(document.createTextNode(event.data));
  document.getElementById('messages').appendChild(item);
};




socket.onclose = (event) => {
    clearInterval(heartbeat_interval);
    console.log(`Server closing with code ${event.code}`);
  };
  


