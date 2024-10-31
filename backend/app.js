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
import emailSenderRouter from './app/routes/email-sender.routes.js';
import exchangeRateRouter from './app/routes/exchange-rate.routes.js';
import reportRouter from './app/routes/report.routes.js';
import userRouter from './app/routes/user.routes.js';
import accountClosureRouter from './app/routes/account-closure.routes.js';

const app = express();

app.use(express.json());
app.use(bodyParser.json({ limit: '15mb' }));
app.use(cors());

const api = '/api';
const authenticator = `${api}/authenticator`;
const tokenLinkedApi = `${api}/token-linked-api`;
const bankAccount = `${api}/bank-account`;
const emailSender = `${api}/email-sender`;
const exchangeRate = `${api}/exchange-rate`;
const report = `${api}/report`;
const user = `${api}/user`;
const accountClosure = `${api}/account-closure`;

app.use(authenticator, authenticatorRouter);
app.use(tokenLinkedApi, tokenLinkedApiRouter);
app.use(bankAccount, bankAccountRouter);
app.use(emailSender, emailSenderRouter);
app.use(exchangeRate, exchangeRateRouter);
app.use(report, reportRouter);
app.use(user, userRouter);
app.use(accountClosure, accountClosureRouter);


export default app;
