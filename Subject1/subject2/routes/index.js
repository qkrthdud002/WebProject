const express = require('express');
const router = express.Router();
const db = require('../models/sqlite-db');
const memosql = require('../models/memo-sql');

/* GET home page. */
router.get('/', function(req, res, next) {
  db.executeQuery(memosql.selectAllMemoSql(), (error, rows)=>{
    if(error) res.json({error: error.message});
    res.render("home");
  });
});

router.get("/login", (req, res)=>{
  res.render('login');
})

router.get("/index", (req, res)=> {
  db.executeQuery(memosql.selectAllMemoSql(), (error, rows)=>{
    if(error) res.json({error: error.message});
    res.render("index",{rows});
  });
})

router.get("/auth/logout", (req, res)=>{
  res.render('/');
  alert("로그아웃 되었습니다.");
})

module.exports = router;
