import express from 'express';
import cors from 'cors';
import { postUser } from './controller/signUp/signUp.js';

const app = express();
app.use(cors());
app.use(express.json());

app.post("/SignUp", postUser);

app.listen(4000);