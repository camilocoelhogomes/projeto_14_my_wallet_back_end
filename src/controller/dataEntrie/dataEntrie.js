import { existOne } from "../../dataBase/dataBaseValidations.js";
import { postContabilDataDb } from "../../dataBase/postContabilDataDb/postContabilDataDb.js";
import { getContabilDataDb } from "../../dataBase/postContabilDataDb/getContabilDataDb.js";
import dataEntrieSchema from "./dataEntrieSchema.js";

const postContabilData = async (req, res) => {

    const authorization = req.headers.authorization;
    const token = authorization?.replace('Bearer ', '');
    if (!token) return res.sendStatus(401);
    const movementData = req.body;
    const { error: joiError } = dataEntrieSchema.validate(movementData);
    if (joiError || !(movementData?.contabilType === 'credit' ? movementData?.contabilType !== 'debit' : movementData?.contabilType === 'debit')) {
        return res.sendStatus(400);
    }
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
        if (!isUser.rowCount) return res.sendStatus(401);
        await postContabilDataDb({ ...movementData, userId: isUser.rows[0].userId });
        res.status(201).send({ ...movementData, userId: isUser.rows[0].userId });
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
}

const getContabilData = async (req, res) => {
    const authorization = req.headers.authorization;
    const token = authorization?.replace('Bearer ', '');
    if (!token) return res.sendStatus(401);

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

        if (!isUser.rowCount) return res.sendStatus(401);
        const userData = await getContabilDataDb({ token: token });
        if (!userData.rowCount) return res.sendStatus(204);
        return res.status(200).send({ movments: userData.rows });
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}

export { postContabilData, getContabilData }