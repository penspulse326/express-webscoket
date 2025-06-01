import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT ?? '9001';

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '..', 'views'));

app.use(express.static(path.join(__dirname, '..', 'public')));

app.get('/', (_, res) => {
  res.render('index', {
    message: 'Hello World from EJS!',
    title: 'Express with EJS',
  });
  console.log('Response sent with EJS template');
});

// 保留原始的 API 端點
app.get('/api', (_, res) => {
  res.send('Hello World!');
  console.log('API Response sent');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
