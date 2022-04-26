
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');


const generateHash = async (password) => {
    const passwordHash = await bcrypt.hash(password, 10)
    .catch(err => console.log(err))
    return passwordHash;
}

const generateToken = (user) => {
    const mpJWT = jwt.sign({ id: user.id }, "AUTH-SECRET", { expiresIn: 60*60*24*60 });
    return mpJWT
}

module.exports = (app, prisma) => {
    
    app.get('/signup', (req, res) => {
        res.render('signup.hbs')
    });

    app.post('/signup', async (req, res) => {
        
        let password = req.body.password;
        let passwordHash = await generateHash(password);
        
        await prisma.user.create({
            data: {
                username: req.body.username,
                password: passwordHash
            }
        })
        .then(() => console.log('created user'))
        .catch((err) => {
            console.log('error creating user');
            res.redirect('/signup');
        })

        res.redirect('/');
    });

    app.get('/login', (req, res) => {
        res.render('login')
    })

    app.post('/login', async (req, res) => {
    
        let user = await prisma.user.findFirst({
            where: {
                username: req.body.username
            }
        })
        .catch(err => console.log(err))

        if (!user) {
            console.log('user not found')
            res.redirect('/login')
        }

        let password = req.body.password;
        let passwordHash = user.password;
        const match = await bcrypt.compare(password, passwordHash)
        .catch(err => console.log(err))

        if (match) {
            console.log('password match')
            const token = generateToken(user);
            res.cookie('authToken', token);
            console.log('cookie set')
            res.redirect('/')
        } else {
            console.log('password does not match')
            res.redirect('/login')
        }

    });

    app.get('/logout', (req, res) => {
        res.clearCookie('authToken');
        res.redirect('/');
    });

}