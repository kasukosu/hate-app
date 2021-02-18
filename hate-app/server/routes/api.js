const express = require ('express');
const router = express.Router();
const Post = require('../models/post');

router.get('/posts', (req, res, next) => {
    Post.find({},'message')
        .then(data => res.json(data))
        .catch(next)
});

router.post('/posts', (req, res, next) => {
    if(req.body.message){
        Post.create(req.body)
            .then(data => res.json(data))
            .catch(next)
    }
    else {
        res.json({
            error: "Message input is required"
        })
    
    }
});

router.delete('/posts/:id', (req, res, next) => {
    Post.findOneAndDelete({"_id": req.params.id})
        .then(data => res.json(data))
        .catch(next)
})

module.exports = router;