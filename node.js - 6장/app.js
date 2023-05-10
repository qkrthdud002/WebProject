const express = require('express');
const morgan = require('morgan');
const cookiParser = require('cookie-parser');
const session = require('express-session');
const dotenv = require('dotenv');
const path = require('path');
const cookieParser = require('cookie-parser');
const indexRouter = require('./routes');
const userRouter = require('./routes/user');

dotenv.config();
const app = express();
app.set('port', process.env.PORT || 3000);

// app.get('/', (req, res) => {
//     res.send('Hello, Express');
// });


app.use(morgan('dev'));
app.use('/', express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use('/', indexRouter);
app.use('/user', userRouter);
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
        httpOnly: true,
        secure: false,
    },

    name: 'session-cookie',
}));

app.use((req, res, next) => {
    console.log('모든 요청에 다 실행됩니다.');
    next();
});

app.get('/', (req, res, next) => {
    console.log('GET / 요청에서만 실행됩니다.');
    next();
}, (req, res) => {
    throw new Error('에러는 에러 처리 미들웨어로 갑니다.');
});

// callback 함수에 파라미터가 err가 있으면 무조건 에러 처리.
app.use((err, req, res, next) => {
    console.log(error);
    res.status(500).send(err.message);
});


app.use((req, res, next) => {
    res.status(404).send('Not Found');
});


app.listen(app.get('port'), () => {
    console.log(app.get('port'), '빈 포트에서 대기 중');
});

// app.use((req, res, next) => {
//     if(process.env.NODE_ENV === 'production') {

//     }
// })