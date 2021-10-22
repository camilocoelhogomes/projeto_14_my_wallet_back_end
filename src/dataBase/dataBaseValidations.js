import connection from "./dataBaseConfig.js";

const existOne = ({ dataSearch, table }) => {
    let query = `SELECT * from "${table}" WHERE `;

    const dependencyArray = [];
    dataSearch.forEach((data, index) => {
        query += `"${data.collum}" = ($${index + 1})${index + 1 === dataSearch.length ? ';' : ' OR '}`;
        dependencyArray.push(data.data);
    });

    return connection.query(query, dependencyArray);
}

export {
    existOne,
}