const express = require('express');
const {
  test,
  getMyPosts,
  getPostsByHashtag,
  //renderMain,
  getAllPosts,
  editPost,
  deletePost,
} = require('../controllers');

const router = express.Router();

router.get('/test', test);

router.get('/myposts', getMyPosts);
router.get('/search', getPostsByHashtag);
router.get('/', getAllPosts);
router.post('/post/:id', editPost);
router.delete('/post/:id', deletePost);

module.exports = router;