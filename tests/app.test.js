import app from "../src/app";
import supertest from 'supertest';
import connection from '../src/dataBase/dataBaseConfig.js';

beforeAll(async () => {
    return await connection.query(`DELETE FROM users;DELETE FROM sessions;DELETE FROM entries`);
});

afterAll(async () => {
    await connection.query(`DELETE FROM users;DELETE FROM sessions;DELETE FROM entries`);
    const body = {
        name: 'Camilo',
        email: 'camilo.coelho.gomes@gmail.com',
        password: '12345678*AbC',
        passwordConfirm: '12345678*AbC',
    }
    return await supertest(app).post('/sign-up').send(body);

});

describe("POST /sigin-up", () => {
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
});

describe("POST /sigin-in", () => {
    it("returns 200 for valid entrie", async () => {
        const body = {
            email: 'camilo.coelho.gomes@gmail.com',
            password: '12345678*AbC'
        }
        const result = await supertest(app).post('/sign-in').send(body);
        expect(result.status).toEqual(200)
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

    it("returns 201 for valid credit", async () => {
        const bodyLogin = {
            email: 'camilo.coelho.gomes@gmail.com',
            password: '12345678*AbC'
        }
        const resultLogin = await supertest(app).post('/sign-in').send(bodyLogin);
        const token = `Bearer ${resultLogin.body.token}`
        const body = {
            description: 'Test entrie',
            contabilType: 'credit',
            value: 10.5,
        }

        const result = await supertest(app).post('/contabil-data').set('Authorization', token).send(body)

        expect(result.status).toEqual(201)

    });

    it("returns 201 for valid debit", async () => {
        const bodyLogin = {
            email: 'camilo.coelho.gomes@gmail.com',
            password: '12345678*AbC'
        }
        const resultLogin = await supertest(app).post('/sign-in').send(bodyLogin);
        const token = `Bearer ${resultLogin.body.token}`
        const body = {
            description: 'Test entrie',
            contabilType: 'debit',
            value: 10.5,
        }
        const result = await supertest(app).post('/contabil-data').set('Authorization', token).send(body)

        expect(result.status).toEqual(201)

    });

    it("returns 400 for invalid contabilType", async () => {
        const bodyLogin = {
            email: 'camilo.coelho.gomes@gmail.com',
            password: '12345678*AbC',
            contabilType: 'deit',
        }
        const resultLogin = await supertest(app).post('/sign-in').send(bodyLogin);
        const token = `Bearer ${resultLogin.body.token}`
        const body = {
            description: 'Test entrie',
            contabilType: 'debt',
            value: 10.5,
        }
        const result = await supertest(app).post('/contabil-data').set('Authorization', token).send(body)

        expect(result.status).toEqual(400)

    });

    it("returns 400 for invalid body", async () => {
        const bodyLogin = {
            email: 'camilo.coelho.gomes@gmail.com',
            password: '12345678*AbC'
        }
        const resultLogin = await supertest(app).post('/sign-in').send(bodyLogin);
        const token = `Bearer ${resultLogin.body.token}`
        const body = {
            description: 'Test entrie',
        }
        const result = await supertest(app).post('/contabil-data').set('Authorization', token).send(body)

        expect(result.status).toEqual(400)

    });

    it("returns 401 for invalid token", async () => {
        const bodyLogin = {
            email: 'camilo.coelho.gomes@gmail.com',
            password: '12345678*AbC'
        }
        const resultLogin = await supertest(app).post('/sign-in').send(bodyLogin);
        const token = `Bearer `
        const body = {
            description: 'Test entrie',
            contabilType: 'credit',
            value: 10.5,
        }
        const result = await supertest(app).post('/contabil-data').set('Authorization', token).send(body)

        expect(result.status).toEqual(401)

    });

});

describe("GET /contabil-data", () => {
    afterEach(async () => {
        await connection.query(`DELETE FROM entries`);
    })
    it("return 200 for valid entrie", async () => {
        const bodyLogin = {
            email: 'camilo.coelho.gomes@gmail.com',
            password: '12345678*AbC'
        }
        const resultLogin = await supertest(app).post('/sign-in').send(bodyLogin);
        const token = `Bearer ${resultLogin.body.token}`
        const result = await supertest(app).get('/contabil-data').set('Authorization', token);
        expect(result.status).toEqual(200)
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
        const bodyLogin = {
            email: 'camilo.coelho.gomes@gmail.com',
            password: '12345678*AbC'
        }
        const resultLogin = await supertest(app).post('/sign-in').send(bodyLogin);
        const token = `Bearer ${resultLogin.body.token}`
        const result = await supertest(app).get('/contabil-data').set('Authorization', token);
        expect(result.status).toEqual(204)
    })
})

describe("POST /log-out", () => {
    it("return 200 for a valid logout", async () => {
        const bodyLogin = {
            email: 'camilo.coelho.gomes@gmail.com',
            password: '12345678*AbC'
        }
        const resultLogin = await supertest(app).post('/sign-in').send(bodyLogin);
        const token = `Bearer ${resultLogin.body.token}`

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