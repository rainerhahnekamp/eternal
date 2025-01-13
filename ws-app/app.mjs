import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 8080 });

const messages = [
  'Hello, I need help.',
  'Do I need a visa for Austria?',
  'Do you offer group discounts?',
  'Do you offer also individual packages?',
  'Can you resend the invoice please?',
  'I need to cancel my booking. What do I have to do?',
  'Where I can see the pictures from journey',
  'Can you send me the contact data from the group, I\'ve travelled with?',
  'Can I rebook for next year?',
  'Can I switch from a double to a single room?',
  'What kind of vaccines do I require?',
  'Is it safe in Austria?',
  'Do Austrians speak English?',
  'What is the currency in Denmark?',
  'Can I book my own flight?'
];

wss.on('connection', function connection(ws) {
  ws.on('error', console.error);

  ws.on('message', function message(data) {
    console.log('received: %s', data);
  });

  ws.send(JSON.stringify({status: 'connected'}));
  setInterval(() => {
    if (Math.random() * 4 > 3) {
      const message = messages[Math.floor(Math.random() * messages.length)]
      console.log(`sending message ${message}`)
      ws.send(JSON.stringify({ message }));
    }
  }, 1000);
});

console.log("WebSocket up and running...");
