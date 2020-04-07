const express = require('express');

const server = express();
const postRouter = require('../posts/postRouter.js');


server.use(express.json());
server.use('/api/posts', postRouter);

server.get('/', (req,res) => {
    res.status(200).json({message: 'server is running (200)'});
});

module.exports = server; 