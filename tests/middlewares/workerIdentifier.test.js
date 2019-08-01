process.env.NODE_ENV = 'testing';
var request = require('supertest');
var App = require('./../../src/app.js');

describe('Worker Identifier Middleware', () => {
    it('Should add the workerid 1 to the Response', async (done) => {
        var application = new App({
            enableLogger: false,
            mode: 'worker'
        });
        const response = await request(application).get('/status');

        expect(response.headers.workerid).toBe('1');
        done();
    });

    it('Should not add a workerid to the Response', async (done) => {
        var application = new App({
            enableLogger: false,
            mode: 'main'
        });
        const response = await request(application).get('/status');

        expect(typeof response.headers.workerid).toBe('undefined');
        done();
    });
});
