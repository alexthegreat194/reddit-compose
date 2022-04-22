const express = require('express');
const { engine } = require('express-handlebars');

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

app.get('/', (req, res) => {
    res.redirect('/posts/index');
});

require('./controllers/posts')(app);
require('./controllers/comments')(app);

app.listen(3000);

module.exports = app;