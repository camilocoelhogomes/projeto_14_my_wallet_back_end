import connection from "../dataBaseConfig.js";

const postToken = ({ userId, token }) => {
    const dependencyArray = [userId, token]

    return connection.query(`
        INSERT INTO 
            sessions ("userId",token) 
        VALUES 
            ($1,$2)`,
        dependencyArray)

}

export { postToken }