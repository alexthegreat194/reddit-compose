const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

module.exports = (app) => {

    app.post('/comments/new', async (req, res) => {
        if (!res.locals.currentUser) {
            res.redirect('/login')
            return
        }
        
        console.log(req.body);
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
            return
        }

        let parentCommentId = parseInt(req.body.parentCommentId);

        if (parentCommentId) {
            const parentComment = await prisma.comment.findFirst({
                where: {
                    id: parentCommentId
                }
            });

            if (!parentComment) {
                console.log('parent comment does not exist')
                res.redirect('/')
                return
            }
        }

        const comments = await prisma.comment.create({
            data: {
                content: req.body.content,
                postId: post.id,
                userId: res.locals.currentUser.id,
                parentCommentId: parentCommentId ? parentCommentId : null
            }
        })
        
        res.redirect('/posts/' + post.id)
    });

}