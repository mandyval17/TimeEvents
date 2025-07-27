require('dotenv').config();
import cookieParser from 'cookie-parser';
// import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import api from './api';
import cors from 'cors';
// import { env } from './env';
import MessageResponse from './interfaces/message-response';
import { notFound } from './middlewares/notFound';
import { errorHandler } from './middlewares/errorHandler';
import { terminalLogger } from './middlewares/terminalLogger';
import bullBoardAdapter from './../src/api/bullBoard';


const app = express();


app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,            // if you need to send cookies/auth headers
}));
app.use(terminalLogger);
app.use(helmet());
// app.use(cors({
//   origin: env.CORS_ORIGINS.split(',').map((origin) => origin.trim()),
//   credentials: true,
// }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cookieParser());

app.get<{}, MessageResponse>('/', (req, res) => {
  res.json({
    data: null,
    message: '🦄🌈✨👋🌎🌍🌏✨🌈🦄',
  });
});

app.use('/api/v1', api);

app.use('/admin/queues', bullBoardAdapter.getRouter());



app.use(notFound);
app.use(errorHandler);

export default app;
