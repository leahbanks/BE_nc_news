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
    })
    it('the array should have the expected length and properties', () => {
        return request(app).get('/api/topics').then((response) => {
            const topics = response.body;
            expect(topics).toHaveLength(3)
            topics.forEach((topic) => {
                expect(topic).toHaveProperty('slug')
                expect(topic).toHaveProperty('description')
            })
        })
    })
    it('should return a 404 error when an incorrect path is followed', () => {
        return request(app).get('/api/topics/3')
    })

describe('GET/api/articles', () => {
    it('should return a status of 200', () => {
        return request(app).get('/api/articles')
        .expect(200);
    })
    it('should return an array', () => {
        return request(app).get('/api/articles').then((response) => {
            const articles = response.body;
            expect(Array.isArray(articles)).toBe(true);
        })
    })
    it('should have the expected properties', () => {
        return request(app).get('/api/articles').then((response) => {
            const articles = response.body;
            articles.forEach((article) => {
                expect(article).toHaveProperty('author')
                expect(article).toHaveProperty('title')
                expect(article).toHaveProperty('article_id')
                expect(article).toHaveProperty('topic')
                expect(article).toHaveProperty('created_at')
                expect(article).toHaveProperty('votes')
                expect(article).toHaveProperty('article_img_url')
                expect(article).toHaveProperty('comment_count')
            })
            
    })
    })
})
