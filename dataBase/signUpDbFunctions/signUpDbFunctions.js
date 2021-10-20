import connection from "../dataBaseConfig.js";

const createDbNewUser = ({ name, email, password }) => {
    const dependencyArray = [name, email, password]

    return connection.query(`
        INSERT INTO 
            users (name,email,password) 
        VALUES 
            ($1,$2,$3)`,
        dependencyArray)

}

export { createDbNewUser }