/*
* @author
* Mariano Camposeco {@literal (mariano1941@outlook.es)}
*/
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import authenticatorRouter from './app/routes/authenticator.routes.js';

const app = express();               

app.use(express.json());
app.use(bodyParser.json({ limit: '15mb' }));
app.use(cors());

const api = '/api';
const authenticator = `${api}/authenticator`;

app.use(authenticator, authenticatorRouter);

export default app;
