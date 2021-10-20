import signUpSchema from './validateSignUp.js';
import bcrypt from 'bcrypt';
import { createDbNewUser } from '../../dataBase/signUpDbFunctions/signUpDbFunctions.js';
import { existOne } from '../../dataBase/dataBaseValidations.js';

const postUser = async (req, res) => {
    const { name: userName, email, password } = req.body;
    const { error } = signUpSchema.validate(req.body);

    if (!!error) return res.status(400).send(error.details);
    const cryptPassword = bcrypt.hashSync(password, 10);
    //const dbMessage =  await createDbNewUser({ name: userName, email: email, password: cryptPassword });
    const isUser = await existOne({
        dataSearch: [
            {
                collum: 'name',
                data: userName
            },
            {
                collum: 'email',
                data: email
            },
        ],
        table: 'users'
    });
    if (isUser.rowCount !== 0) return res.sendStatus(409);
    return res.sendStatus(200)
}

export { postUser }