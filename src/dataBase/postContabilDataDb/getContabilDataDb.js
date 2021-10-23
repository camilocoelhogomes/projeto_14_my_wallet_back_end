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

const sumContabilType = ({ token }) => {
    const dependencieArray = [token];
    const query = `
    SELECT 
        entries."contabilType", SUM(entries.value) 
    FROM 
        entries 
    JOIN 
        sessions 
    ON 
        sessions."userId" = entries."userId" 
    WHERE 
        sessions."token" = $1 
    GROUP BY 
        entries."contabilType";
    `
    return connection.query(query, dependencieArray);
}

export { getContabilDataDb, sumContabilType }