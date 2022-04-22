
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

module.exports = (app) => {

    app.post('/comments/new', async (req, res) => {
        if (!res.locals.currentUser) {
            res.redirect('/login')
        }

        const postId = parseInt(req.body.postId)

        if (!postId) {
            console.log('postId not in req.body')
            res.redirect('/')
        }

        const post = await prisma.post.findFirst({
            where: {
                id: postId
            }
        })

        if (!post) {
            console.log('post does not exist')
            res.redirect('/')
        }

        const comments = await prisma.comment.create({
            data: {
                content: req.body.content,
                postId: post.id
            }
        })
        
        res.redirect('/posts/' + post.id)
    });

}