import express from 'express';
import cors from 'cors';
import { postUser } from './controller/siginUp/siginUp.js';
import { getUser } from './controller/signIn/signIn.js';
import { getContabilData, postContabilData } from './controller/dataEntrie/dataEntrie.js';

const app = express();
app.use(cors());
app.use(express.json());

app.post("/SignUp", postUser);
app.post("/", getUser);

app.post("/contabilData", postContabilData);
app.get("/contabilData", getContabilData);

export default app;