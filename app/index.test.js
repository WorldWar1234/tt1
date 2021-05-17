const request = require('supertest');
const index = require('./index');

describe('index', () => {
    test('GET /', () => {
        return request(index).get('/').then(response => {
            expect(response.statusCode).toBe(200);
        })
    });
});
