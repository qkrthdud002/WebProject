const express = require('express');

const {isLoggedIn}=require('../middlewares');
const {follow} = require('../controllers/users');
const {unfollow} = require('../controllers/users');

const router = express.Router();

router.post('/:id/follow', isLoggedIn, follow);
router.post('/:id/unfollow', isLoggedIn, unfollow);
module.exports = router;