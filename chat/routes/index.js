const express = require('express');
const { renderMain, renderRoom, createRoom, enterRoom, removeRoom, sendChat } = require('../controllers');

const router = express.Router();

// router.get('/', (req, res) => {
//     res.render('index');
// });

router.get('/', renderMain);

router.get('/room', renderRoom);

router.post('/room', createRoom);

router.get('/room/:id', enterRoom);

router.delete('/room/:id', removeRoom);

router.post('/room/:id/chat', sendChat);

module.exports = router;