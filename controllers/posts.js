const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

module.exports = (app) => {

    app.get('/posts/index', async (req, res) => {
        
        const posts = await prisma.post.findMany({
            include: {
                subreddit: true,
                user: true,
                upvotes: true,
                downvotes: true,
            }
        });
        // console.log(posts);

        posts.map(post => {
            post.upvotes = post.upvotes.length;
            post.downvotes = post.downvotes.length;
            post.score = post.upvotes - post.downvotes;
        })
        
        // console.log(posts);

        res.render('posts-index', { posts })
    });

    app.get('/posts/new', (req, res) => {
        if (!res.locals.currentUser) {
            res.redirect('/login')
        }
        res.render('posts-new');
    })

    app.post('/posts/new', async (req, res) => {
        if (!res.locals.currentUser) {
            console.log('user not logged in')
            res.redirect('/login')
            return;
        }
        
        try {

            let subreddit = await prisma.subreddit.findFirst({
                where: {
                    name: req.body.subreddit
                }
            });
            if (!subreddit) {
                console.log('subreddit not found');
                subreddit = await prisma.subreddit.create({
                    data: {
                        name: req.body.subreddit
                    }
                });
                console.log('subreddit created');
            }


            await prisma.post.create({
                data: {
                    title: req.body.title,
                    url: req.body.url,
                    summary: req.body.summary,
                    subredditId: subreddit.id,
                    userId: res.locals.currentUser.id
                }
            })
            .then((post) => {
                console.log('Post created: ', post);
            })
        } catch (error) {
            console.log(error);
        }

        res.redirect('/');
    });

    app.get('/posts/:id', async (req, res) => {

        const postId = parseInt(req.params.id);
        console.log('postId: ', postId);

        const post = await prisma.post.findFirst({
            where: {
                id: postId
            },
            include: {
                subreddit: true,
                comments: {
                    include: {
                        post: true,
                        user: true,
                        replies: {
                            include: {
                                user: true
                            }
                        },
                    }
                },
                user: true
            }
        });
        // console.log(post);
        res.render('posts-show', {post});
    });

    app.get('/posts/:id/delete', async (req, res) => {
        if (!res.locals.currentUser) {
            res.redirect('/login')
        }

        const postId = parseInt(req.params.id);
        // console.log('postId:', postId);

        const post = await prisma.post.findFirst({
            where: {
                id: postId
            }
        });

        if (!post) {
            console.log('post does not exist');
            res.redirect('/posts/' + postId);
        } else if (post.userId != res.locals.currentUser.id) {
            console.log('user does not own post');
            res.redirect('/posts/' + postId);
            
        } else {
            await prisma.post.delete({
                where: {
                    id: postId
                }
            });
            await prisma.comment.deleteMany({
                where: {
                    postId: postId
                }
            });
            res.redirect('/')
        }

    });

    app.get('/n/:subreddit', async (req, res) => {
        const posts = await prisma.post.findMany({
            where: {
                subreddit: {
                    name: req.params.subreddit
                }
            },
            include: {
                subreddit: true
            }
        });
        res.render('posts-index', { posts, subreddit: req.params.subreddit });
    });

    app.put('/posts/:id/upvote', async (req, res) => {

    
        const postId = parseInt(req.params.id);
        // console.log('postId:', postId);

        //create un upvote
        await prisma.upvotes.create({
            data: {
                postId: postId,
            }
        });

        return res.status(200)
    });

    app.put('/posts/:id/downvote', async (req, res) => {

    
        const postId = parseInt(req.params.id);
        // console.log('postId:', postId);

        //create un downvote
        await prisma.downvotes.create({
            data: {
                postId: postId,
            }
        });

        return res.status(200)
    });

};