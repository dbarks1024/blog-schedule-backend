const express = require('express'),
  moment = require('moment'),
  router = express.Router(),
  Post = require('../models/posts');

router.post('/post', (req, res) => {
  const newPost = {
    title: req.body.title,
    date: moment(req.body.date, 'YYYY-MM-DD'),
    description: req.body.description,
    category: req.body.category,
    status: req.body.status,
    author: req.body.author,
  };
  if (newPost.title === undefined || newPost.status === undefined) {
    res.send('Missing title or status');
  } else {
    Post.create(newPost, (err, newPost) => {
      console.log(newPost);
      if (err) {
        res.send(err);
      } else {
        res.json(newPost);
      }
    });
  }
});

router.put('/post/:id', (req, res) => {
  const data = req.body;
  const postData = {
    title: data.title,
    date: moment(data.date, 'YYYY-MM-DD'),
    description: data.description,
    category: data.category,
    status: data.status,
    author: data.author,
  };
  if (postData.title === undefined || postData.status === undefined) {
    res.send('Missing title or status');
  } else {
    Post.findByIdAndUpdate(req.params.id, postData, (err, updatedPostData) => {
      if (err) {
        res.send(err);
      } else {
        res.json(updatedPostData);
      }
    });
  }
});

router.delete('/post/:id', (req, res) => {
  Post.findByIdAndDelete(req.params.id, (err) => {
    if (err) {
      res.send(err);
    } else {
      res.send('success');
    }
  });
});

router.get('/post/:id', (req, res) => {
  Post.findById(req.params.id, (err, foundPost) => {
    if (err) {
      res.send(err);
    } else {
      res.json(foundPost);
    }
  });
});

router.get('/post', (req, res) => {
  Post.find((err, foundPosts) => {
    if (err) {
      res.send(err);
    } else {
      res.json(foundPosts);
    }
  });
});

router.get('/', function (req, res) {
  res.send('working');
});


module.exports = router;