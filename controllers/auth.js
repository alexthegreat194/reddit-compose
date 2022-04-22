
const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient()

module.exports = (app) => {
    
    app.get('/signup', (req, res) => {
        res.render('signup.hbs')
    });

    app.get('/login', (req, res) => {
        res.render('login')
    })

}