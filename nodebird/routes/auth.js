const express = require('express');
const passport = require('passport');

const {isLoggedIn, isNotLoggedIn} = require('../middlewares');
const {join, login, logout} = require('../controllers/auth');

const router = express.Router();

//post / auth/join
router.post('/join', isNotLoggedIn, join);

//post / auth/login
router.post('/login', isNotLoggedIn, login);

//get / auth/logout
router.get('/logout', isLoggedIn, logout);

//get / auth/kakao/callback
router.get('/kakao', passport.authenticate('kakao'));


//get / auth/kakao/callback
router.get('/kakao/callback', passport.authenticate('kakao', {
  failureRedirect:'/?loginError=카카오로그인 실패',
}), (req, res)=>{
  res.redirect('/');
});

module.exports=router;



