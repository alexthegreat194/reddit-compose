
const { PrismaClient } = require('@prisma/client');

module.exports = (app) => {

    app.post('/posts/new', async (req, res) => {
        console.log('/posts/new', req.body);        
        
        try {
            const prisma = new PrismaClient();
            await prisma.$connect();
            await prisma.post.create({
                data: {
                    title: req.body.title,
                    url: req.body.url,
                    summary: req.body. summary,
                }
            })
            .then(() => {
                console.log('Post created');
            })
        } catch (error) {
            console.log(error);
        }

        res.redirect('/');
    });

};