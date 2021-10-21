import siginInSchema from './validateSignIn.js';
import bcrypt from 'bcrypt';
import { existOne } from '../../dataBase/dataBaseValidations.js';
import { v4 as uuid } from 'uuid';
import { postToken } from '../../dataBase/signInDbFunctions/postToken.js';

const getUser = async (req, res) => {
    const { email, password } = req.body;
    const { error } = siginInSchema.validate(req.body);
    if (!!error) return res.status(400).send(error);

    try {
        const isUser = await existOne({
            dataSearch: [
                {
                    collum: 'email',
                    data: email
                },
            ],
            table: 'users'
        });
        if (isUser.rowCount === 0) return res.sendStatus(401);

        if (!bcrypt.compareSync(password, isUser.rows[0].password)) return res.sendStatus(401);
        const token = uuid();
        await postToken({ userId: isUser.rows[0].id, token });
        const user = {
            name: isUser.rows[0].name,
            email: isUser.rows[0].email,
            token,
        };

        return res.status(200).send(user);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}

export { getUser }