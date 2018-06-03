const express = require('express');
const app = express();
const cors = require('cors');
const server = require('http').createServer(app);
const io = require('socket.io')(server);

app.use(cors());
app.use(express.static('public'));
app.set('port', process.env.PORT || 3000);

require('./messages')(io);

server.listen(app.get('port'), () => {
  console.log(`slack-like-server is now running on port ${app.get('port')}...`);
});
