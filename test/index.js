// test/index.js
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
const should = chai.should();

chai.use(chaiHttp);

const { PrismaClient } = require('@prisma/client');

// test the /posts/index route with 
describe('/posts/index', () => {
    it('should return all posts', (done) => {
        chai.request(app)
            .get('/posts/index')
            .end((err, res) => {
                res.should.have.status(200);
                done();
            });
    });
});

// test the /posts/new route
describe('/posts/new', () => {

    it('should render the new post form', (done) => {
        chai.request(app)
            .get('/posts/new')
            .end((err, res) => {
                res.should.have.status(200);
                done();
            });
    });

    it('should create a new post', (done) => {
        chai.request(app)
            .post('/posts/new')
            .send({
                title: 'Test Post',
                url: 'http://test.com',
                summary: 'This is a test post'
            })
            .end(async (err, res) => {
                res.should.have.status(200);

                const prisma = new PrismaClient();
                prisma.$connect();

                const post = await prisma.post.findFirst({
                    where: {
                        title: 'Test Post'
                    }
                })
                .catch(error => {
                    console.log(error);
                });
                post.should.have.property('title', 'Test Post');
                
                // remove the post
                await prisma.post.delete({
                    where: {
                        id: post.id
                    }
                })
                .catch(error => {
                    console.log(error);
                });

                done();
            });
    });

});