const request = require('supertest')
const seed  = require('../db/seeds/seed')
const app = require('../app')
const data = require('../db/data/test-data')
const db = require('../db/connection')

beforeEach(() => {
    return seed(data)
})

afterAll(() => {
    db.end()
})

describe('GET/api/topics', () => {
    it('should return a status of 200', () => {
        return request(app).get('/api/topics')
        .expect(200)
    });
    it('should return an array', () => {
        return request(app).get('/api/topics').then((response) => {
            const topics = response.body;
            expect(Array.isArray(topics)).toBe(true);
        })
    })
    it('should have the expected properties', () => {
        return request(app).get('/api/topics').then((response) => {
            const topics = response.body;
            topics.forEach((topic) => {
                expect(topic).toHaveProperty('slug')
                expect(topic).toHaveProperty('description')
            })
            
    })
})
})
