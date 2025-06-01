import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import WebSocket, { WebSocketServer } from 'ws';

type Message = {
  message: string;
  timestamp: number;
  user: string;
};

/**
 * 聊天室 WebSocket 伺服器
 */
const users = new Set();
const messages: Message[] = [];
const wss = new WebSocketServer({ port: 8080 }, () => {
  console.log('=================================');
  console.log('🔌 WebSocket 伺服器已啟動');
  console.log('📡 WebSocket 伺服器運行在: ws://localhost:8080');
  console.log('=================================');
});

wss.on('connection', (ws: WebSocket) => {
  console.log('=================================');
  console.log('✅ 新的 WebSocket 連接已建立');
  console.log('=================================');

  const user = crypto.randomUUID();
  users.add(user);
  console.log(`👤 新的使用者 ${user} 已加入:`, users);

  ws.send(
    JSON.stringify({
      messages,
      user,
    }),
  );

  ws.on('error', console.error);

  ws.on('message', function message(data) {
    const dataString = Buffer.isBuffer(data) ? data.toString() : data;
    const { message, timestamp, user } = JSON.parse(dataString as string) as Message;

    messages.push({ message, timestamp, user });

    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(messages));
      }
    });
  });

  ws.on('close', () => {
    console.log('=================================');
    console.log('❌ WebSocket 連接已關閉');
    console.log('=================================');
  });
});

/**
 * 聊天室 Express 伺服器
 */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT ?? '9001';

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (_, res) => {
  res.render('index', {
    messages,
    users,
  });
});

app.listen(port, () => {
  console.log('=================================');
  console.log('🚀 Express 伺服器已啟動');
  console.log(`📡 HTTP 伺服器運行在: http://localhost:${port}`);
  console.log('=================================');
});
