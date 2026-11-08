import express from 'express';
import api from './api/index.js';
import {errorHandler, notFoundHandler} from './middlewares/error-handlers.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/public', express.static('public'));
app.use('/api/v1', api);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
