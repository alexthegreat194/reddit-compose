const express = require('express');
const { engine } = require('express-handlebars');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

require('dotenv').config();

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const connectToDb = async () => {
    try {
        await prisma.$connect();
    } catch (error) {
        throw error;
    }
}

const app = express();

app.engine('hbs', engine({
    extname: 'hbs',
    defaultLayout: 'main'
}));
app.set('view engine', 'hbs');
app.set('views', './views');

app.use(express.static('public')); // static files
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(cookieParser());

app.use(function authenticateToken(req, res, next) {
    // Gather the jwt access token from the cookie
    const token = req.cookies.authToken;
  
    if (token) {
        jwt.verify(token, "AUTH-SECRET", (err, user) => {
            if (err) {
                console.log(err)
                // redirect to login if not logged in and trying to access a protected route
                res.redirect('/login')
            }
            req.user = user
            next(); // pass the execution off to whatever request the client intended
        })
    } else {
      next();
    }
});
  
app.use(async (req, res, next) => {
      // if a valid JWT token is present
    if (req.user) {
        // Look up the user's record
        const user = await prisma.user.findFirst({
            where: {
                id: req.user.id
            }
        })
        .then(currentUser => {
            // make the user object available in all controllers and templates
            res.locals.currentUser = currentUser;
            next()
        }).catch(err => {
            console.log(err)
        })
    } else {    
        next();
    }
});

app.get('/', (req, res) => {
    res.redirect('/posts/index');
});

require('./controllers/posts')(app);
require('./controllers/comments')(app);
require('./controllers/auth')(app);

app.listen(process.env.PORT || 3000, () => {
    console.log(`Server started on port ${process.env.PORT || 3000}`);
});

module.exports = app;