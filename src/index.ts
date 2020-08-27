import { PrismaClient } from '@prisma/client';
import express from 'express';

const prisma = new PrismaClient();
const app = express();

app.use(express.json());

app.get('/users', async (req, res) => {
    const users = await prisma.user.findMany();
    res.json(users);
});

app.get('/feed', async (req, res) => {
    try {
        const posts = await prisma.post.findMany({
            where: { published: true },
            include: { author: true }
        });
        res.status(200).json(posts);
    }
    catch (ex) {
        console.error(ex);
        res.status(500).send();
    }
});

app.get('/post/:id', async (req, res) => {
    try {
        const post = await prisma.post.findOne({ where: { id: Number(req.params.id) } });
        res.status(200).json(post);
    } catch (ex) {
        res.status(500).send();
        console.error(ex);
    }
});

app.post('/users', async (req, res) => {
    try {
        const user = await prisma.user.create({ data: { ...req.body } });
        res.status(201).send(JSON.stringify(user));
    } catch (ex) {
        console.error(ex);
        res.status(500).send();
    }
});

app.post('/post', async (req, res) => {
    try {
        const { title, content, authorEmail } = req.body;

        const post = await prisma.post.create({ data: {
            title,
            content,
            published: false,
            author: { connect: { email: authorEmail } }
        } });
        res.status(201).send(JSON.stringify(post));
    } catch (ex) {
        console.error(ex);
        res.status(500).send();
    }
});

app.put('/post/publish/:id', async (req, res) => {
    try {
        const post = await prisma.post.update({
            where: { id: Number(req.params.id) },
            data: { published: true }
        });
        res.status(200).json(post);
    }
    catch (ex) {
        res.status(500).send();
    }
});

app.delete('/post/:id', async (req, res) => {
    try {
        const post = await prisma.post.delete({ where: { id: Number(req.params.id) } });
        res.status(200).json(post);
    }
    catch (ex) {
        res.status(500).send();
    }
});

app.listen(3000, () => {
    console.log('Listening on PORT 3000');
});
