import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import WebSocket, { WebSocketServer } from 'ws';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT ?? '9001';

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (_, res) => {
  res.render('index', {
    message: 'Hello World from EJS!',
    title: 'Express with EJS',
  });
  console.log('Response sent with EJS template');
});

app.get('/api', (_, res) => {
  res.send('Hello World!');
  console.log('API Response sent');
});

app.listen(port, () => {
  console.log('=================================');
  console.log('🚀 Express 伺服器已啟動');
  console.log(`📡 HTTP 伺服器運行在: http://localhost:${port}`);
  console.log('=================================');
});

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

  ws.on('error', console.error);

  ws.on('message', function message(data) {
    const message = Buffer.isBuffer(data) ? data.toString() : data;
    console.log('📨 收到訊息:', message);
  });

  ws.on('close', () => {
    console.log('=================================');
    console.log('❌ WebSocket 連接已關閉');
    console.log('=================================');
  });
});
