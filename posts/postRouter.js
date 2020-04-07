const express = require('express');

const db = require('../data/db.js');

const router = express.Router();

router.get('/', (req,res) => {
db.find()
.then(posts => res.status(200).json(posts))
.catch(err => res.status(500).json({error: "The posts information could not be retrieved."}));
});

router.post('/', (req,res)=> {
    const post = req.body;
    if(post.title && post.contents){
        return db.insert(post)
            .then(postObject => {
             db.findById(postObject.id)
                .then(newPost => res.status(201).json(newPost)
                )
                .catch(err => res.status(500).json({message: "The posts information could not be retrieved."}));
            })
              .catch( err => res.status(500).json({message: "There was an error while saving the post to the database."}))
            }else{
            return res.status(404).json({message:"Please provide title and contents for the post."});
        }
});

router.post("/:id/comments", (req, res) => {
    const id = req.params.id;
     
        db.findById(id)
          .then(posts => {
            if (!posts){
              res.status(404).json({ errorMessage: "The post with the specified ID does not exist." });
            } else if (!req.body.post_id || !req.body.text){
                  res.status(400).json({ errorMessage: "Please provide title and text for the comment." });
                } else {
                  db.insertComment(req.body)
                    .then(comments => { 
                      db.findCommentById(comments.id)  
                      .then(comment => {
                        res.status(201).json(comment)
                  })
                })
                .catch(err => {
                    res.status(500).json({errorMessage: "There was an error while saving the comment to the database", err});
              });   
          }
      })
});

router.get('/:id', (req,res)=>{
    const id = req.params.id;
        db.findById(id)
         .then(post => {
            console.log(post)
            if(post.length !== 0){
                return res.status(200).json(post);
            }else{
            return res.status(404).json({message: "The post with the specified ID does not exist."});
            }
    })
    .catch(err => res.status(500).json({error: "The post information could not be retrieved."}));
});

router.get('/:id/comments', (req,res)=> {
    const postId = req.params.id;
        db.findPostComments(postId)
         .then(comment => {
            //console.log(comment);
            if(comment.length > 0 ){
             res.status(200).json(comment)
            }else{
            res.status(404).json({message: "The post with the specified ID does not exist."});
         }
    })
    .catch(err => res.status(500).json({error: "The post information could not be retrieved."}));
});

router.delete('/:id', (req,res)=>{
    const id = req.params.id;
    db.findById(id)
    .then(deleteId => {
        db.remove(id)
        .then(postDeleted => {
            if (postDeleted > 0) {
                res.status(200).json(deleteId);
            }else{
                res.status(404).json({ message: "The post with the specified ID does not exist." });
            }
        }).catch(err => res.status(500).json({error: "The post could not be removed."}));
    })
    .catch(err => {
        res.status(500).json({message: "The post with the specified ID does not exist."});
    })
});

router.put('/:id',(req, res)=>{
    const id = req.params.id;
    const body = req.body
    if(body.title && body.contents){
        db.update(id, body)
        .then(count => {
            console.log(count)
            if(count > 0 ){
                db.findById(id)
                .then( object => {
                    res.status(200).json(object)
                }).catch(err => res.status(500).json({message:"Post updated but will not return"}) );
            }else{
                res.status(404).json({error: "No post in the database with the given ID."});
            }
        })
        .catch(err => res.status(500).json({error: "The post information could not be modified."}));
    }else{
        return res.status(400).json({errorMessage: "Please provide title and contents for the post." });
    }
});
module.exports = router;