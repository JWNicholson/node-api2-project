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
                .catch(err => res.status(500).json({message: "The posts information could not be retrieved".}));
            })
              .catch( err => res.status(500).json({message: "There was an error while saving the post to the database"}))
            }else{
            return res.status(404).json({message:"Please provide title and contents for the post."});
        }
});



module.exports = router;