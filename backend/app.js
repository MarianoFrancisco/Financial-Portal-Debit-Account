/*
* @author
* Mariano Camposeco {@literal (mariano1941@outlook.es)}
*/
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import authenticatorRouter from './app/routes/authenticator.routes.js';
import tokenLinkedApiRouter from './app/routes/token-linked-api.routes.js';
import bankAccountRouter from './app/routes/bank-account.routes.js';

const app = express();               

app.use(express.json());
app.use(bodyParser.json({ limit: '15mb' }));
app.use(cors());

const api = '/api';
const authenticator = `${api}/authenticator`;
const tokenLinkedApi = `${api}/token-linked-api`;
const bankAccount = `${api}/bank-account`;

app.use(authenticator, authenticatorRouter);
app.use(tokenLinkedApi, tokenLinkedApiRouter);
app.use(bankAccount, bankAccountRouter);

export default app;
