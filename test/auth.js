
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
const should = chai.should();

chai.use(chaiHttp);

const { PrismaClient } = require('@prisma/client');
const { expect } = require('chai');

describe('/signup', () => {
    it('should render the signup form', (done) => {
        chai.request(app)
            .get('/signup')
            .end((err, res) => {
                res.should.have.status(200);
                done();
            }); 
    })

    it('should create a new user', (done) => {
        chai.request(app)
            .post('/signup')
            .send({
                username: 'test',
                password: 'test'
            })
            .then(async (res) => {
                res.should.have.status(200);

                const prisma = new PrismaClient();

                const user = await prisma.user.findFirst({
                    where: {
                        username: 'test'
                    }
                })
                .catch(error => {
                    console.log(error);
                    done(error);
                });
                
                expect(user).to.have.property('username', 'test');

                // remove the user
                await prisma.user.delete({
                    where: {
                        username: 'test'
                    }
                })
                .catch(error => {
                    console.log(error);
                    done();
                });
                
            })
            .then(() => done())
    });

});