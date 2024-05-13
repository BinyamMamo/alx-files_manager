#!/usr/bin/node
import express from 'express';
import 'dotenv/config';
import router from './routes/index';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use('/', router);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
