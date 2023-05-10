const mongoose = require('mongoose');
const { MONGO_ID, MONGO_PASSWORD } = process.env;

const connect = async () => {
    if( process.env.NODE_ENV !== 'production' ) {
        mongoose.set('debug', true);
    }
    try {
        await mongoose.connect(
            `mongodb://${MONGO_ID}:${MONGO_PASSWORD}@localhost:27017/admin`,
            //'mongodb://soyoung:1234@localhost:27017/admin',
            {
                dbName: 'gifchat',
                useNewUrlParser: true,
            }
        );
        console.log('몽고디비 연결 성공');
    } catch(err) {
        console.log('몽고디비 연결 에러', err);
    }
};

mongoose.connection.on('error', (error) => {
    console.error('connection error', error);
});

mongoose.connection.on('disconnected', () => {
    console.error('disconnected');
    connect();
});

module.exports = connect;