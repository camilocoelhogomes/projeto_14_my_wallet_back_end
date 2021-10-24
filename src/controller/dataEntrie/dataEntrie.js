import { existOne } from "../../dataBase/dataBaseValidations.js";
import { postContabilDataDb } from "../../dataBase/postContabilDataDb/postContabilDataDb.js";
import { getContabilDataDb, sumContabilType } from "../../dataBase/postContabilDataDb/getContabilDataDb.js";
import dataEntrieSchema from "./dataEntrieSchema.js";

const XOR = ({ input, equals: [xor1, xor2] }) => {
    return input === xor1 ? input !== xor2 : input === xor2
}

const postContabilData = async (req, res) => {

    const authorization = req.headers.authorization;
    const token = authorization?.replace('Bearer ', '');
    if (!token) return res.sendStatus(401);
    const movementData = req.body;
    const { error: joiError } = dataEntrieSchema.validate(movementData);
    if (joiError || !XOR({ input: req.body.contabilType, equals: ['credit', 'debit'] })) {
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
        const totalArray = await sumContabilType({ token: token });
        const total = totalArray.rows.reduce((acc, cur) => cur.contabilType === 'credit' ? acc + cur.sum : acc - cur.sum, 0);
        return res.status(200).send({ movments: userData.rows, total });
    } catch (error) {
        res.sendStatus(500);
    }
}

export { postContabilData, getContabilData }