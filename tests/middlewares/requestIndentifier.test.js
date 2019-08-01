process.env.NODE_ENV = 'testing';
var request = require('supertest');
var App = require('./../../src/app.js');

describe('Request Identifier Middleware', () => {
    it('Should add the provided RequestID to the Response', async (done) => {
        var application = new App({
            enableLogger: false,
            enableRequestIdentifier: true
        });
        const response = await request(application)
            .get('/status')
            .set('RequestID', '834180130-ioasdsaj-12381231');

        expect(response.headers.requestid).toBe('834180130-ioasdsaj-12381231');
        done();
    });

    it('Should add a new RequestID to the Response', async (done) => {
        var application = new App({
            enableLogger: false,
            enableRequestIdentifier: true
        });
        const response = await request(application).get('/status');

        expect(typeof response.headers.requestid).toBe('string');
        done();
    });

    it('Should not add a new RequestID to the Response', async (done) => {
        var application = new App({
            enableLogger: false,
            enableRequestIdentifier: false
        });
        const response = await request(application).get('/status');

        expect(typeof response.headers.requestid).toBe('undefined');
        done();
    });

    it('Should not propagate the specified RequestID to the Response', async (done) => {
        var application = new App({
            enableLogger: false,
            enableRequestIdentifier: false
        });
        const response = await request(application)
            .get('/status')
            .set('RequestID', '834180130-ioasdsaj-12381231');

        expect(typeof response.headers.requestid).toBe('undefined');
        done();
    });
});
