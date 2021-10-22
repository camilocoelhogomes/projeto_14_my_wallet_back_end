import app from "../src/app";
import supertest from 'supertest';
import connection from '../src/dataBase/dataBaseConfig.js';

beforeAll(async () => {
    return await connection.query(`DELETE FROM users;DELETE FROM sessions;DELETE FROM entries`);
});

describe("POST /sigin-up", () => {
    it("returns 201 for valit params", async () => {
        const body = {
            name: 'Camilo',
            email: 'camilo.coelho.gomes@gmail.com',
            password: '12345678*AbC'
        }
        const result = await supertest(app).post('/sign-up').send(body);
        expect(result.status).toEqual(201)
    });

    it("returns 409 for conflict paramms", async () => {
        const body = {
            name: 'Camilo',
            email: 'camilo.coelho.gomes@gmail.com',
            password: '12345678*AbC'
        }
        const result = await supertest(app).post('/sign-up').send(body);
        expect(result.status).toEqual(409)
    });

    it("returns 400 for invalid paramms", async () => {
        const body = {
            name: 'Camilo',
            email: 'camilo.coelho.gomes@gmail.com',
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
            password: '12345678*AbC'
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