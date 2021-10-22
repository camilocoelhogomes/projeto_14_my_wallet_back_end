import { existOne } from "../../dataBase/dataBaseValidations.js";
import { logOutDb } from "../../dataBase/logOutDb/logOutDb.js";

const postLogout = async (req, res) => {
    const authorization = req.headers.authorization;
    const token = authorization?.replace('Bearer ', '');
    if (!token) return res.sendStatus(400);

    try {
        const isUser = await existOne(
            {
                dataSearch: [
                    {
                        collum: 'token',
                        data: token
                    }
                ],
                table: 'sessions',
            }
        );
        if (!isUser.rowCount) return res.sendStatus(400);
        await logOutDb({ token });
        return res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}

export { postLogout }