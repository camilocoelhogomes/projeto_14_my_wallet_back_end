import connection from "../dataBaseConfig.js";
import { v4 as uuid } from 'uuid';

const postContabilDataDb = ({
    userId,
    description,
    contabilType,
    value,
}) => {
    const dependencieArray = [uuid(), userId, description, contabilType, value];
    return connection.query(`
    INSERT INTO 
        entries ("fakeId","userId","description","contabilType","value")
    VALUES
        ($1,$2,$3,$4,$5);
    `, dependencieArray)

}

export { postContabilDataDb };