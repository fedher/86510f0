const { assert } = require('chai');

const rest = require('./libs/rest');
const apiKey = require('./keys/employee');

const url = 'http://localhost:3000/users';

let userIdA;
let userIdB;

describe('Employee Tests:', () => {

    it('should create an employee', async () => {
        try {
            const { body, status } = await rest.req('post', url, {}, {
                name: 'Carl Pulkit',
                email: 'car@m.com',
                password: 'test234',
                role: 'employee'
            });
            userIdA = body.id;

            assert.equal(status, 200, 'status should be 200');
            assert.equal(body.name, 'Carl Pulkit');
            assert.equal(body.email, 'car@m.com');
            assert.equal(body.role, 'employee');

        } catch (err) {
            assert.fail();
        }
    });

    it('should create an employee', async () => {
        try {
            const { body, status } = await rest.req('post', url, {}, {
                name: 'Juan Mon',
                email: 'juan@m.com',
                password: 'test',
                role: 'employee'
            });
            userIdB = body.id;

            assert.equal(status, 200, 'status should be 200');
            assert.equal(body.name, 'Juan Mon');
            assert.equal(body.email, 'juan@m.com');
            assert.equal(body.role, 'employee');

        } catch (err) {
            assert.fail();
        }
    });

    it('should not get an employee data as another emplyee', async () => {
        try {
            await rest.req('get', `${url}/${userIdB}`, apiKey);
            assert.fail();
        } catch (error) {
            assert.equal(error.statusCode, 403, 'status should be 403');
        }
    });

    it('should update their personal user data', async () => {
        try {
            const { body, status } = await rest.req('put', `${url}/${userIdA}`, apiKey, {
                name: 'Pity Martinez',
                email: 'pity@m.com',
                password: 'test2'
            });

            assert.equal(status, 200, 'status should be 200');
            assert.equal(body.name, 'Pity Martinez');
            assert.equal(body.email, 'pity@m.com');
            assert.equal(body.role, 'employee');

        } catch (error) {
            assert.fail();
        }
    });

    it('should not update other user data', async () => {
        try {
            await rest.req('put', `${url}/${userIdB}`, apiKey, {
                name: 'Pity Martinez',
                email: 'pity@m.com',
                password: 'test2'
            });

            assert.fail();

        } catch (error) {
            assert.equal(error.status, 403, 'status should be 403');
        }
    });

    it('should not delete other employee data', async () => {
        try {
            await rest.req('delete', `${url}/${userIdB}`, apiKey);
            assert.fail();

        } catch (error) {
            assert.equal(error.status, 403, 'status should be 403');
        }
    });

    it('should create an employee', async () => {
        try {
            const { body, status } = await rest.req('post', url, {}, {
                name: 'Carl Pulkit',
                email: 'car@m.com',
                password: 'test234',
                role: 'employee'
            });
            userIdA = body.id;

            assert.equal(status, 200, 'status should be 200');
            assert.equal(body.name, 'Carl Pulkit');
            assert.equal(body.email, 'car@m.com');
            assert.equal(body.role, 'employee');

        } catch (err) {
            assert.fail();
        }
    });

    it('should not get a list of employees as employee', async () => {
        try {
            await rest.req('get', `${url}`, apiKey);
            assert.fail();

        } catch (error) {
            assert.equal(error.statusCode, 403, 'status should be 403');
        }
    });

    it('should delete their own user data', async () => {
        try {
            const { status } = await rest.req('delete', `${url}/${userIdA}`, apiKey);
            assert.equal(status, 200, 'status should be 200');

        } catch (error) {
            assert.fail();
        }
    });

});
