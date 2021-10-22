import express from 'express';
import cors from 'cors';
import { postUser } from './controller/siginUp/siginUp.js';
import { getUser } from './controller/signIn/signIn.js';
import { getContabilData, postContabilData } from './controller/dataEntrie/dataEntrie.js';

const app = express();
app.use(cors());
app.use(express.json());

app.post("/sign-up", postUser);
app.post("/sign-in", getUser);

app.post("/contabil-data", postContabilData);
app.get("/contabil-data", getContabilData);

export default app;