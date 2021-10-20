import siginInSchema from './validateSignIn.js';
import bcrypt from 'bcrypt';
import { existOne } from '../../dataBase/dataBaseValidations.js';

const getUser = async (req, res) => {
    const { email, password } = req.body;
    const { error } = siginInSchema.validate(req.body);
    if (!!error) return res.status(401).send(error);

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
        if (isUser.rowCount === 0) return res.sendStatus(404);

        if (!bcrypt.compareSync(password, isUser.rows[0].password)) return res.sendStatus(401);

        const user = {
            name: isUser.rows[0].name,
            email: isUser.rows[0].email
        };

        return res.status(200).send(user);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}

export { getUser }