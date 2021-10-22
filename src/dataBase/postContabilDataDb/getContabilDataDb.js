import connection from "../dataBaseConfig.js";

const getContabilDataDb = ({ token }) => {
    const dependencieArray = [token];
    const query = `
        SELECT 
            entries."fakeId" as "id",
            entries."date",
            entries."description",
            entries."contabilType",
            entries."value"
        FROM 
            entries
        JOIN 
            sessions
        ON
            entries."userId" = sessions."userId"
        WHERE 
            sessions.token = $1;
    `;
    return connection.query(query, dependencieArray);
}

export { getContabilDataDb }