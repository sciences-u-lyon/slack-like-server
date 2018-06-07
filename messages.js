const uuidv1 = require('uuid/v1');
const format = require('date-fns/format');
const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');

const window = (new JSDOM('')).window;
const DOMPurify = createDOMPurify(window);

const messages = require('./messages.json');
const LIMIT = 1000;

module.exports = io => {
  io.on('connection', socket => {
    socket.emit('slack:messages', messages);

    socket.on('slack:new-message', (message, nickname = 'johndoe') => {
      if (!message) {
        return;
      }
      if (messages.length === LIMIT) {
        messages.splice(0, 1);
      }
      messages.push({
        id: uuidv1(),
        content: DOMPurify.sanitize(message),
        timestamp: format(new Date(), 'HH:mm A'),
        sender: {
          nickname: DOMPurify.sanitize(nickname),
          avatar: 'img/avatar.jpg'
        }
      });

      const newMessage = messages[messages.length - 1];
      io.emit('slack:new-message', newMessage);
    });
  });
};
