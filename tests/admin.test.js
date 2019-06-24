const { assert } = require('chai');

const rest = require('./libs/rest');
const apiKey = require('./keys/admin');

const url = 'http://localhost:3000/users';

let adminId;
let employeeId;

describe('Admin Tests:', () => {

    it('should create an admin', async () => {
        try {
            const { body, status } = await rest.req('post', url, {}, {
                name: 'Fed Hern',
                email: 'fed@m.com',
                password: 'test',
                role: 'admin'
            });
            adminId = body.id;
            assert.equal(status, 200, 'status should be 200');
            assert.equal(body.name, 'Fed Hern');
            assert.equal(body.email, 'fed@m.com');
            assert.equal(body.role, 'admin');

        } catch (err) {
            assert.fail();
        }
    });

    it('should create an employee', async () => {
        try {
            const { body, status } = await rest.req('post', url, {}, {
                name: 'Carl Pulkit',
                email: 'car@m.com',
                password: 'test',
                role: 'employee'
            });
            employeeId = body.id;

            assert.equal(status, 200, 'status should be 200');
            assert.equal(body.name, 'Carl Pulkit');
            assert.equal(body.email, 'car@m.com');
            assert.equal(body.role, 'employee');

        } catch (err) {
            assert.fail();
        }
    });

    it('should get an employee as admin', async () => {
        try {
            const { body, status } = await rest.req('get', `${url}/${employeeId}`, apiKey);

            assert.equal(status, 200, 'status should be 200');
            assert.equal(body.name, 'Carl Pulkit');
            assert.equal(body.email, 'car@m.com');
            assert.equal(body.role, 'employee');

        } catch (error) {
            assert.fail();
        }
    });

    it('should update an employee data as admin user', async () => {
        try {
            const { body, status } = await rest.req('put', `${url}/${employeeId}`, apiKey, {
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

    it('should delete an employee user as admin', async () => {
        try {
            const { status } = await rest.req('delete', `${url}/${employeeId}`, apiKey);

            assert.equal(status, 200, 'status should be 200');

        } catch (error) {
            assert.fail();
        }
    });

    it('should delete the admin user', async () => {
        try {
            const { status } = await rest.req('delete', `${url}/${adminId}`, apiKey);

            assert.equal(status, 200, 'status should be 200');

        } catch (error) {
            assert.fail();
        }
    });
});
