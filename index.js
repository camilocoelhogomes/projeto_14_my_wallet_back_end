import express from 'express';
import cors from 'cors';
import { postUser } from './controller/siginUp/siginUp.js';
import { getUser } from './controller/signIn/signIn.js';

const app = express();
app.use(cors());
app.use(express.json());

app.post("/SignUp", postUser);
app.get("/", getUser);

app.listen(4000);