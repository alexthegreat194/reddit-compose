
const {PrismaClient} = require('@prisma/client')
const bcrypt = require('bcrypt')

const prisma = new PrismaClient()

const generateHash = async (password) => {
    const passwordHash = await bcrypt.hash(password, 10)
    .catch(err => console.log(err))
    return passwordHash;
}

module.exports = (app) => {
    
    app.get('/signup', (req, res) => {
        res.render('signup.hbs')
    });

    app.post('/signup', async (req, res) => {
        
        let password = req.body.password;
        let passwordHash = await generateHash(password);
        
        prisma.user.create({
            data: {
                username: req.body.username,
                password: passwordHash
            }
        })
        .then(() => console.log('created user'))

        res.redirect('/');
    });

    app.get('/login', (req, res) => {
        res.render('login')
    })

    

}