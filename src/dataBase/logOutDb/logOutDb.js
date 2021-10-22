import connection from "../dataBaseConfig.js";

const logOutDb = ({ token }) => {
    const query = `DELETE FROM sessions WHERE sessions.token = $1;`
    const dependencyArray = [token];

    return connection.query(query, dependencyArray);
}

export { logOutDb }