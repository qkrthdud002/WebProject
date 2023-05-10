const bcrypt = require('bcrypt');
const passport = require('passport');
const User = require('../models/user');

exports.join = async (req, res, next) => {
    const {email, nick, password} = req.body;
    try {
        const exUser = await User.findOne({where: {email}});
        if(exUser) {
            return res.redirect('/join?error=exist');
        }
        const hash = await bcrypt.hash(password, 12);
        await User.create({
            email,
            nick,
            password: hash,
        });
        return res.redirect('/');
    } catch(error) {
        console.error(error);
        return next(error);
    }
}

exports.login = (req, res, next) => {
    passport.authenticate('local', (authError, user, info) => {
        if(authError) {
            console.error(authError);
            return next(authError);
        }
        if(!user) {
            return res.redirect(`/?loginError=${info.message}`);
        }
        return req.login(user, (loginError) => {
            if(loginError) {
                console.error(loginError);
                return next(loginError);
            }
            return res.redirect('/');
        });
    }) (req, res, next); // 미들웨어 내의 미들웨어에는 (req, res, next)를 붙인다.
};

// exports.AllPosts = async (req, res, next) => {
//     try {
//       const result = await request(req, '/posts');
//       //res.json(result.data);
//       if (result.data.code != 200) {
//         const error = new Error(result.data.message);
//         error.status = result.data.code;
//         next(error);
//       } else {
//         console.log(result.data.payload);
//         res.render('main', {
//           title: 'allposts',
//           posts: result.data.payload,
//         });
//       }
//     } catch (err) {
//       console.error(err);
//       next(err);
//     }
//   };


exports.logout = (req, res) => {
    req.logout(() => {
        res.redirect('/');
    });
};