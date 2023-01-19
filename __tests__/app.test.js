const request = require('supertest')
const seed  = require('../db/seeds/seed')
const app = require('../app')
const data = require('../db/data/test-data')
const db = require('../db/connection')
const sort = require('jest-sorted');

beforeEach(() => {
    return seed(data)
})

afterAll(() => {
    db.end()
})

describe('API', () => {
    it('should return a 404 error when an incorrect path is followed', () => {
        return request(app).get('/api/not-a-path').expect(404).then(({ body }) => {
            expect(body.msg).toBe('Path Not Found');
        })
    })
})
describe('Get Topics', () => {
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
    })
})

    
describe('Get Articles', () =>{
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
        it('the array should have the expected length and properties', () => {
            return request(app).get('/api/articles').then((response) => {
                const articles = response.body;
                expect(articles).toHaveLength(12)
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
        it('each article should have the correct comment_count data', () => {
            return request(app).get('/api/articles').then((response) => {
            const articles = response.body;
            expect(articles[0].comment_count).toBe(2)
            expect(articles[1].comment_count).toBe(1)
        })
    })
        it('the articles should be sorted by date (created_at) in descending order', () => {
            return request(app).get('/api/articles').then((response) => {
                const articles = response.body;
                expect(articles).toBeSortedBy('created_at',{ descending: true })
             })
         })
    })
})

describe('Get Articles by Article ID', () => {
    describe('GET/api/articles/:article_id', () => {
        it('should return a status of 200', () => {
            return request(app).get('/api/articles/1').expect(200);
    })
        it('should return the correct article object with the corresponding article_id and the expected properties', () => {
            return request(app).get('/api/articles/1').then(({body: {article}}) => {
                expect(article.article_id).toBe(1)
                expect(article).toHaveProperty('author')
                expect(article).toHaveProperty('title')
                expect(article).toHaveProperty('body')
                expect(article).toHaveProperty('topic')
                expect(article).toHaveProperty('created_at')
                expect(article).toHaveProperty('votes')
                expect(article).toHaveProperty('article_img_url')
            })
        })
            it('should return 404 - article not found when input an article_id that does not exist', () => {
                return request(app).get('/api/articles/2000').expect(404).then(({ body }) => {
                    expect(body.msg).toBe('Article ID Not Found')
            })
         })
            it('should return 400 - bad request when passed an ID that is not a number', () => {
                return request(app).get('/api/articles/notanumber').expect(400).then((response) => {
                    expect(response.body.msg).toBe('Article ID must be a number')
            });
        })
    })
})

describe('Get Comments by Article ID', () => {
    describe('GET/api/articles/:article_id/comments', () => {
        it('should return a status of 200', () => {
            return request(app).get('/api/articles/9/comments').expect(200);
})
        it('should return an array of comments for the given article id with the expected length and properties', () => {
            return request(app).get('/api/articles/9/comments').expect(200).then((response) => {
            const comments = response.body;
            expect(comments).toHaveLength(2);
            comments.forEach((comment) => {
                expect(comment).toHaveProperty('comment_id')
                expect(comment).toHaveProperty('votes')
                expect(comment).toHaveProperty('created_at')
                expect(comment).toHaveProperty('author')
                expect(comment).toHaveProperty('body')
        })
    })
})
        it('the comments should be sorted by date (created_at) in descending order', () => {
            return request(app).get('/api/articles/1/comments').then((response) => {
            const comments = response.body;
            expect(comments).toBeSortedBy('created_at',{ descending: true })
    })
})
        it('should return 404 - article not found when input an article_id that does not exist', () => {
            return request(app).get('/api/articles/7000/comments').expect(404).then(({ body }) => {
            expect(body.msg).toBe('Article ID Not Found')
    })
})  
        it('should return 400 - bad request when passed an ID that is not a number', () => {
            return request(app).get('/api/articles/notanumber/comments').expect(400).then((response) => {
                expect(response.body.msg).toBe('Article ID must be a number')
            });
        })
    })
})


describe('Post Comment by Article ID', () => {
    describe('POST/api/articles/:article_id/comments', () => {
        it('201: posts a new comment and responds with the posted comment', () => {
            const newComment = {
                username: 'butter_bridge',
                body: 'I love this article!',
            }
            return request(app).post('/api/articles/1/comments').send(newComment).expect(201).then(({body}) => {
                const postedComment = body;
                expect(postedComment.body).toBe('I love this article!')
                expect(postedComment.author).toBe('butter_bridge')
                expect(postedComment.comment_id).toBe(19)
                expect(body).toHaveProperty('votes')
                expect(body).toHaveProperty('created_at')
        })
    })
        it('adds the posted comment to the comments table', () => {
            const newComment = {
                username: 'butter_bridge',
                body: 'I love this article!',
            }
            return request(app).post('/api/articles/1/comments').send(newComment).expect(201).then(() => {
                return request(app).get('/api/articles/1/comments').expect(200).then(({body}) => {
                    const comments = body
                    expect(comments.length).toBe(12)
            })
        })
    });
        it('should return 404 - article not found when input an article_id that does not exist', () => {
            const newComment = {
                username: 'butter_bridge',
                body: 'I love this article!',
            }
            return request(app).post('/api/articles/7000/comments').send(newComment).expect(404).then(({body}) => {
                expect(body.msg).toBe('Article ID Not Found')
        })
     })
        it('should return 400 - bad request when passed an ID that is not a number', () => {
            const newComment = {
                username: 'butter_bridge',
                body: 'I love this article!',
            }
            return request(app).post('/api/articles/notanumber/comments').send(newComment).expect(400).then(({body}) => {
                expect(body.msg).toBe('Article ID must be a number')
        });
    })
        it('should return 400 - bad request if missing required fields', () => {
            const newComment = { username: 'butter_bridge' }
            return request(app).post('/api/articles/1/comments').send({newComment}).expect(400).then(({body}) => {
                expect(body.msg).toBe('Required field(s) empty')

            const anotherNewComment = { body: 'I love this article!' }
            return request(app).post('/api/articles/3/comments').send({anotherNewComment}).expect(400).then(({body}) => {
                expect(body.msg).toBe('Required field(s) empty')
            });
        })
    })
        it('should return 400 - bad request if body is empty', () => {
            return request(app).post('/api/articles/1/comments').send({}).expect(400).then(({body}) => {
                expect(body.msg).toBe('Required field(s) empty')
        });
    })
        it('should return 400 - bad request if username does not exist', () => {
            const newComment = {
                username: 'leahb',
                body: 'I love this article!',
            }
            return request(app).post('/api/articles/1/comments').send(newComment).expect(400).then(({body}) => {
                expect(body.msg).toBe('Username does not exist')
            })
         })
    })
})
