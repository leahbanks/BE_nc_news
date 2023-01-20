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
            return request(app).get('/api/articles').then(({body}) => {
                const articles = body.articles;
                expect(Array.isArray(articles)).toBe(true);
         })
    })
        it('the array should have the expected length and properties', () => {
            return request(app).get('/api/articles').then(({body}) => {
                const articles = body.articles;
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
            return request(app).get('/api/articles').then(({body}) => {
            const articles = body.articles;
            expect(articles[0].comment_count).toBe(2)
            expect(articles[1].comment_count).toBe(1)
        })
    })
        it('the articles should be sorted by date (created_at) in descending order', () => {
            return request(app).get('/api/articles').then(({body}) => {
                const articles = body.articles;
                expect(articles).toBeSortedBy('created_at',{ descending: true })
             })
         })
    })

describe('Get Articles (queries)', () => {
    describe('Filter Articles by topic', () => {
        it('should return all articles that match the queried topic', () => {
            return request(app).get('/api/articles?topic=mitch').expect(200).then(({body}) => {
                const articles = body.articles;
                expect(articles.length).toBe(11)
                articles.forEach((article) => {
                    expect(article.topic).toBe('mitch');
                })
              })
            })
        it('should return 404 - bad request when queried with a topic that does not exist', () => {
            return request(app).get('/api/articles?topic=notatopic').expect(404).then(({body}) => {
                    expect(body.msg).toBe('Topic not found');
                 })
            })
        it('should respond with all articles if the query is omitted', () => {
            return request(app).get('/api/articles?topic=').expect(200).then(({body}) => {
                const articles = body.articles;
                    expect(articles.length).toBe(12);
                 })
            })
        })
    })
    describe('Sort Articles', () => {
        it('should sort articles by title and default to descending order', () => {
            return request(app).get('/api/articles?sort_by=title').expect(200).then(({body}) => {
                const articles = body.articles;
                expect(articles).toBeSortedBy('title', { descending: true })
            })
        })
        it('should sort articles by article_id and default to descending order', () => {
            return request(app).get('/api/articles?sort_by=article_id').expect(200).then(({body}) => {
                const articles = body.articles;
                expect(articles).toBeSortedBy('article_id', { descending: true })
            })
        })
        it('should sort articles by comment_count and default to descending order', () => {
            return request(app).get('/api/articles?sort_by=comment_count').expect(200).then(({body}) => {
                const articles = body.articles;
                expect(articles).toBeSortedBy('comment_count', { descending: true })
            })
        })
        it('should sort articles by author and default to descending order', () => {
            return request(app).get('/api/articles?sort_by=author').expect(200).then(({body}) => {
                const articles = body.articles;
                expect(articles).toBeSortedBy('author', { descending: true })
            })
        })
        it('should sort articles by votes and default to descending order', () => {
            return request(app).get('/api/articles?sort_by=votes').expect(200).then(({body}) => {
                const articles = body.articles;
                expect(articles).toBeSortedBy('votes', { descending: true })
            })
        })
        it('should sort articles by title and default to descending order', () => {
            return request(app).get('/api/articles?sort_by=title').expect(200).then(({body}) => {
                const articles = body.articles;
                expect(articles).toBeSortedBy('title', { descending: true })
            })
        })
        it('should return 404 - not found when sorted by a column that does not exist', () => {
            return request(app).get('/api/articles?sort_by=notacolumn').expect(404).then(({body}) => {
                expect(body.msg).toBe('Column does not exist');
        })
    })
    it('should default to sorting by created_at when a column is not specified', () => {
        return request(app).get('/api/articles').expect(200).then(({body}) => {
            const articles = body.articles;
                expect(articles).toBeSortedBy('created_at',{ descending: true })
             })
        })
    })
})
    describe('Order Articles', () => {
        it('should return articles sorted by created_at in descending order by default', () => {
            return request(app).get('/api/articles').expect(200).then(({body}) => {
                const articles = body.articles;
                    expect(articles).toBeSortedBy('created_at', { descending: true })
                 })
            })
            it('should return articles in ascending order when ASC is added to the query', () => {
                return request(app).get('/api/articles?order=ASC').expect(200).then(({body}) => {
                    const articles = body.articles;
                        expect(articles).toBeSortedBy('created_at', { ascending: true })
                })
            })
            it('should return 400 - bad request when query is not ASC or DESC', () => {
                return request(app).get('/api/articles?order=abc').expect(400).then(({body}) => {
                    expect(body.msg).toBe('Invalid query')
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
                    expect(response.body.msg).toBe('Invalid data type')
            });
        })
    })
    describe('GET/api/articles/:article_id (comments)', () => {
        it('an article response object should now include a comment_count property', () => {
            return request(app).get('/api/articles/1').expect(200).then(({body: {article}}) => {
                expect(article).toHaveProperty('comment_count')
            })
        })
        it('the comment_count property should represent the total count of all the comments with this article_id', () => {
            return request(app).get('/api/articles/1').expect(200).then(({body: {article}}) => {
                expect(article.comment_count).toBe(11)
            })
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
                expect(response.body.msg).toBe('Invalid data type')
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
                expect(body.msg).toBe('Invalid data type')
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


describe('Patch votes by Article ID', () => {
    describe('PATCH/api/articles/:article_id', () => {
        it('should return a status of 200', () => {
            const voteIncrease = { inc_votes: 5 }
            return request(app).patch('/api/articles/1').send(voteIncrease).expect(200);
             })
        it('should return 400 - bad request if request body is empty', () => {
            return request(app).patch('/api/articles/1').send().expect(400).then(({body}) => {
                expect(body.msg).toBe('Required field(s) empty')
        })
    })
        it('should return 400 - bad request if required properties are missing', () => {
            return request(app).patch('/api/articles/1').send({votes: 7}).expect(400).then(({body}) => {
                expect(body.msg).toBe('Required field(s) empty')
        })
    })
        it('should return 400 - bad request if the vaue of inc_votes is not a number', () => {
            return request(app).patch('/api/articles/1').send({inc_votes: 'notanumber'}).expect(400).then(({body}) => {
                expect(body.msg).toBe('Invalid data type')
        })
    })
        it('should return 400 - bad request when passed an ID that is not a number', () => {
            return request(app).patch('/api/articles/notanumber').send({ inc_votes: 5 }).expect(400).then(({body}) => {
                expect(body.msg).toBe("Invalid data type")
        })
    })
        it('should return 404 - article not found when input an article_id that does not exist', () => {
            return request(app).patch('/api/articles/7000').send({ inc_votes: 5 }).expect(404).then(({body}) => {
            expect(body.msg).toBe("Article ID Not Found")
        })
    })
        it('should update the votes on the given article by the given amount', () => {
            const voteIncrease = { inc_votes: 5 }
            return request(app).patch('/api/articles/1').send(voteIncrease).expect(200).then(({body}) => {
            const updatedArticle = body
            expect(updatedArticle.article_id).toBe(1)
            expect(updatedArticle.votes).toBe(105)

            const voteDecrease = { inc_votes: -20 }
            return request(app).patch('/api/articles/7').send(voteDecrease).expect(200).then(({body}) => {
            const updatedArticle2 = body
            expect(updatedArticle2.article_id).toBe(7)
            expect(updatedArticle2.votes).toBe(-20)
         })
    })
})
        it('should return the updated article object', () => {
            const voteIncrease = { inc_votes: 29 }
            return request(app).patch('/api/articles/1').send(voteIncrease).expect(200).then(({body}) => {
            const updatedArticle = body
                expect(updatedArticle.article_id).toBe(1)
                expect(updatedArticle.votes).toBe(129)
                expect(updatedArticle).toHaveProperty('title')
                expect(updatedArticle).toHaveProperty('topic')
                expect(updatedArticle).toHaveProperty('author')
                expect(updatedArticle).toHaveProperty('body')
                expect(updatedArticle).toHaveProperty('created_at')
                expect(updatedArticle).toHaveProperty('article_img_url')
            })
        })
    })
})

    describe('Get Users', () => {
        describe('GET /api/users', () => {
            it('should return a status of 200', () => {
                return request(app).get('/api/users').expect(200);
            })
            it('should return an array of user objects with the expected length and properties', () => {
                return request(app).get('/api/users').expect(200).then(({body}) => {
                    const users = body;
                    expect(Array.isArray(users)).toBe(true);
                    expect(users.length).toBe(4);
                    users.forEach((user) => {
                        expect(user).toHaveProperty('username')
                        expect(user).toHaveProperty('name')
                        expect(user).toHaveProperty('avatar_url')
                    })
                })
            })
        })
    })

