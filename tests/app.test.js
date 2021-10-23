import app from "../src/app";
import supertest from 'supertest';
import connection from '../src/dataBase/dataBaseConfig.js';

beforeAll(async () => {
    return await connection.query(`DELETE FROM users;DELETE FROM sessions;DELETE FROM entries`);
});


describe("POST /sigin-up", () => {

    afterAll(async () => {
        return await connection.query(`DELETE FROM users;DELETE FROM sessions;DELETE FROM entries`);
    })

    it("returns 201 for valit params", async () => {
        const body = {
            name: 'Camilo',
            email: 'camilo.coelho.gomes@gmail.com',
            password: '12345678*AbC',
            passwordConfirm: '12345678*AbC',
        }
        const result = await supertest(app).post('/sign-up').send(body);
        expect(result.status).toEqual(201)
    });

    it("returns 409 for conflict paramms", async () => {
        const body = {
            name: 'Camilo',
            email: 'camilo.coelho.gomes@gmail.com',
            password: '12345678*AbC',
            passwordConfirm: '12345678*AbC',
        }
        const result = await supertest(app).post('/sign-up').send(body);
        expect(result.status).toEqual(409)
    });

    it("returns 400 for invalid paramms", async () => {
        const body = {
            name: 'Camilo',
            email: 'camilo.coelho.gomes@gmail.com',
            password: '12345678*AbC',
        }
        const result = await supertest(app).post('/sign-up').send(body);
        expect(result.status).toEqual(400)
    });

    it("returns 400 for wrong confirm password", async () => {
        const body = {
            name: 'Camilo',
            email: 'camilo.coelho.gomes@gmail.com',
            password: '12345678*AbC',
            passwordConfirm: '12345678*AbCd',
        }
        const result = await supertest(app).post('/sign-up').send(body);
        expect(result.status).toEqual(400)
    });

    it("returns 400 for wrong confirm email", async () => {
        const body = {
            name: 'Camilo',
            email: 'camilo.coelho.gomesgmail.com',
            password: '12345678*AbC',
            passwordConfirm: '12345678*AbCd',
        }
        const result = await supertest(app).post('/sign-up').send(body);
        expect(result.status).toEqual(400)
    });

    it("returns 400 for wrong invalid password", async () => {
        const body = {
            name: 'Camilo',
            email: 'camilo.coelho.gomesgmail.com',
            password: '12345678AbC',
            passwordConfirm: '12345678AbCd',
        }
        const result = await supertest(app).post('/sign-up').send(body);
        expect(result.status).toEqual(400)
    });
});

describe("POST /sigin-in", () => {

    beforeAll(async () => {
        return connection.query(`
        INSERT INTO 
            users (name,email,password)
        VALUES
            ('Camilo','camilo.coelho.gomes@gmail.com','$2b$10$3yXzP78c.Asre0Ye.CYOte5YEnzvwF8drtABPK0kEysU8eaDBsbWW');
            `)
    });

    afterAll(async () => {
        return await connection.query(`DELETE FROM users;DELETE FROM sessions;DELETE FROM entries`);
    })

    it("returns 200 for valid entrie", async () => {
        const body = {
            email: 'camilo.coelho.gomes@gmail.com',
            password: '12345678*AbC'
        }
        const result = await supertest(app).post('/sign-in').send(body);
        expect(result.status).toEqual(200);
        expect(result.body).toHaveProperty('token');
        expect(result.body).toHaveProperty('name');
    });

    it("returns 400 for invalid body", async () => {
        const body = {
            email: 'camilo.coelho.gomes@gmail.com',
        }
        const result = await supertest(app).post('/sign-in').send(body);
        expect(result.status).toEqual(400)
    });

    it("returns 401 for wrong passwords", async () => {
        const body = {
            email: 'camilo.coelho.gomes@gmail.com',
            password: '123d45678*AbC'
        }
        const result = await supertest(app).post('/sign-in').send(body);
        expect(result.status).toEqual(401)
    });

});

describe("POST /contabil-data", () => {


    beforeAll(
        async () => {
            await connection.query(`
        INSERT INTO 
            sessions ("userId",token) 
        VALUES 
            (1,'f85a0ca9-2d4f-44e6-bf38-d07f6b9008cb');
        `)
        }
    )

    afterAll(async () => {
        return await connection.query(`DELETE FROM users;DELETE FROM sessions;DELETE FROM entries`);
    })

    it("returns 201 for valid credit", async () => {
        const body = {
            description: 'Test entrie',
            contabilType: 'credit',
            value: 10.5,
        }

        const token = 'Bearer f85a0ca9-2d4f-44e6-bf38-d07f6b9008cb';

        const result = await supertest(app).post('/contabil-data').set('Authorization', token).send(body)

        expect(result.status).toEqual(201)

    });

    it("returns 201 for valid debit", async () => {
        const body = {
            description: 'Test entrie',
            contabilType: 'debit',
            value: 10.5,
        }
        const token = 'Bearer f85a0ca9-2d4f-44e6-bf38-d07f6b9008cb';

        const result = await supertest(app).post('/contabil-data').set('Authorization', token).send(body)

        expect(result.status).toEqual(201)

    });

    it("returns 400 for invalid contabilType", async () => {
        const body = {
            description: 'Test entrie',
            contabilType: 'debt',
            value: 10.5,
        }

        const token = 'Bearer f85a0ca9-2d4f-44e6-bf38-d07f6b9008cb';

        const result = await supertest(app).post('/contabil-data').set('Authorization', token).send(body)

        expect(result.status).toEqual(400)

    });

    it("returns 400 for invalid body", async () => {
        const body = {
            description: 'Test entrie',
        }
        const token = 'Bearer f85a0ca9-2d4f-44e6-bf38-d07f6b9008cb';
        const result = await supertest(app).post('/contabil-data').set('Authorization', token).send(body)

        expect(result.status).toEqual(400)

    });

    it("returns 401 for invalid token", async () => {
        const body = {
            description: 'Test entrie',
            contabilType: 'credit',
            value: 10.5,
        }
        const token = 'Bearer f85a0ca8-2d4f-44e6-bf38-d07f6b9008cb';
        const result = await supertest(app).post('/contabil-data').set('Authorization', token).send(body)

        expect(result.status).toEqual(401)

    });

});
//
describe("GET /contabil-data", () => {
    beforeAll(
        async () => {
            await connection.query(`
        INSERT INTO 
            sessions ("userId",token) 
        VALUES 
            (1,'f85a0ca9-2d4f-44e6-bf38-d07f6b9008cb');
        INSERT INTO
            entries ("fakeId","userId","description","contabilType","value")
        VALUES
            ('f85a0ca9-2d4f-44e6-bf38-d07f6b9008cb',1,'Test insert 1','credit',50);
        INSERT INTO
            entries ("fakeId","userId","description","contabilType","value")
        VALUES
            ('f85a0ga9-2d4f-44e6-bf38-d07f6b9008cb',1,'Test insert 2','debit',15);
        INSERT INTO
            entries ("fakeId","userId","description","contabilType","value")
        VALUES
            ('f85a0ga9-2d4f-44e6-bf38-d07f4b9008cb',1,'Test insert 3','credit',20);
        INSERT INTO
            entries ("fakeId","userId","description","contabilType","value")
        VALUES
            ('f85r0ga9-2d4f-44e6-bg38-d07f6b9008cb',1,'Test insert 4','debit',7);
        INSERT INTO
            entries ("fakeId","userId","description","contabilType","value")
        VALUES
            ('f85g0ca9-2d4f-44e6-bf38-d07f6b9008cb',2,'Test insert 1','credit',50);
        INSERT INTO
            entries ("fakeId","userId","description","contabilType","value")
        VALUES
            ('f85h0ga9-2d4f-44e6-bf38-d07f6b9008cb',4,'Test insert 2','debit',15);
        INSERT INTO
            entries ("fakeId","userId","description","contabilType","value")
        VALUES
            ('f85q0ga9-2d4f-44e6-bf38-d07f4b9008cb',3,'Test insert 3','credit',20);
        INSERT INTO
            entries ("fakeId","userId","description","contabilType","value")
        VALUES
            ('f85x0ga9-2d4f-44e6-bg38-d07f6b9008cb',2,'Test insert 4','debit',7);
        `)
        }
    );

    afterEach(async () => {
        await connection.query(`DELETE FROM entries;`)
    })

    afterAll(async () => {
        return await connection.query(`DELETE FROM users;DELETE FROM sessions;DELETE FROM entries`);

    })

    it("return 200 for valid entrie", async () => {
        const token = `Bearer f85a0ca9-2d4f-44e6-bf38-d07f6b9008cb`
        const result = await supertest(app).get('/contabil-data').set('Authorization', token);
        expect(result.status).toEqual(200);
        expect(result.body).toHaveProperty('movments');
        expect(result.body.movments).toHaveLength(4);
        expect(result.body).toHaveProperty('total', 48);
    })

    it("return 401 for no authorization", async () => {
        const result = await supertest(app).get('/contabil-data');
        expect(result.status).toEqual(401)
    })

    it("return 401 for wrong token", async () => {
        const token = 'sdfasdfasdf';
        const result = await supertest(app).get('/contabil-data').set('Authorization', token);
        expect(result.status).toEqual(401)
    })

    it("return 204 for valid token and no data", async () => {
        const token = `Bearer f85a0ca9-2d4f-44e6-bf38-d07f6b9008cb`
        const result = await supertest(app).get('/contabil-data').set('Authorization', token);
        expect(result.status).toEqual(204)
    })
})

describe("POST /log-out", () => {

    beforeAll(
        async () => {
            await connection.query(`
        INSERT INTO 
            sessions ("userId",token) 
        VALUES 
            (1,'f85a0ca9-2d4f-44e6-bf38-d07f6b9008cb');
        `)
        }
    )

    it("return 200 for a valid logout", async () => {
        const token = `Bearer f85a0ca9-2d4f-44e6-bf38-d07f6b9008cb`

        const result = await supertest(app).post('/log-out').set('Authorization', token);
        expect(result.status).toEqual(200);
    });

    it("return 400 for a invalid logout", async () => {
        const result = await supertest(app).post('/log-out').set('Authorization', '');
        expect(result.status).toEqual(400);
    });

    it("return 400 for a invalid token", async () => {
        const result = await supertest(app).post('/log-out').set('Authorization', 'sadfasdfasdf');
        expect(result.status).toEqual(400);
    });
})

//*/