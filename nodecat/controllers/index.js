const axios = require('axios');

const URL = process.env.API_URL;
axios.defaults.headers.origin = process.env.ORIGIN;

const request = async (req, api, params) => {
  try {
    if (!req.session.jwt) {
      const tokenResult = await axios.post(`${URL}/token`, {
        clientSecret: process.env.CLIENT_SECRET,
      });
      req.session.jwt = tokenResult.data.token;
    }
    return await axios.get(`${URL}${api}`, {
      params,
      headers: { authorization: req.session.jwt },
    });
  } catch (err) {
    if (err.response?.status === 419) {
      // 토큰 만료.
      delete req.session.jwt;
      return request(req, api);
    }
    return err.response;
  }
};

exports.getAllPosts = async (req, res, next) => {
  try {
    const result = await request(req, '/posts');
    //res.json(result.data);
    if (result.data.code != 200) {
      const error = new Error(result.data.message);
      error.status = result.data.code;
      next(error);
    } else {
      console.log(result.data.payload);
      res.render('main', {
        title: 'allposts',
        posts: result.data.payload,
      });
    }
  } catch (err) {
    console.error(err);
    next(err);
  }
};

exports.getMyPosts = async (req, res, next) => {
  try {
    const result = await request(req, '/posts/my');
    //res.json(result.data);
    if (result.data.code != 200) {
      const error = new Error(result.data.message);
      error.status = result.data.code;
      next(error);
    } else {
      console.log(result.data.payload);
      res.render('main', {
        title: 'myposts',
        posts: result.data.payload,
      });
    }
  } catch (err) {
    console.error(err);
    next(err);
  }
};

exports.getPostsByHashtag = async (req, res, next) => {
  try {
    const hashtag = req.query.hashtag;
    const result = await request(
      req,
      `/posts/hashtag/${encodeURIComponent(hashtag)}`
    );
    res.render('main', {
      title: `search`,
      hashtag: hashtag,
      posts: result.data.payload,
    });
  } catch (err) {
    if (err.code) {
      console.error(err);
      next(err);
    }
  }
};

exports.test = async (req, res, next) => {
  // 토큰 테스트 라우터
  try {
    if (!req.session.jwt) {
      // 세션에 토큰이 없으면 토큰 발급 시도
      const tokenResult = await axios.post('http://localhost:8002/v1/token', {
        clientSecret: process.env.CLIENT_SECRET,
      });
      if (tokenResult.data?.code === 200) {
        // 토큰 발급 성공
        req.session.jwt = tokenResult.data.token; // 세션에 토큰 저장
      } else {
        // 토큰 발급 실패
        return res.json(tokenResult.data); // 발급 실패 사유 응답
      }
    }
    // 발급받은 토큰 테스트
    const result = await axios.get('http://localhost:8002/v1/test', {
      headers: { authorization: req.session.jwt },
    });
    return res.json(result.data);
  } catch (error) {
    console.error(error);
    if (error.response?.status === 419) {
      // 토큰 만료 시
      return res.json(error.response.data);
    }
    return next(error);
  }
};

/*exports.renderMain = (req, res) => {
  res.render('main');
};*/

exports.editPost = async (req, res, next) => {
  try {
    console.log(req);
    const postId = req.params.id;
    const params = { content: req.body.content };
    const result = await request(req, `/posts/edit/${postId}`, params);
    if (result.data.code != 200) {
      const error = new Error(result.data.message);
      error.status = result.data.code;
      next(error);
    } else {
      res.redirect('/myposts');
    }
  } catch (err) {
    console.error(err);
    next(err);
  }
};

exports.deletePost = async (req, res, next) => {
  try {
    const postId = req.params.id;
    const result = await request(req, `/posts/delete/${postId}`);
    //res.json(result.data);
    if (result.data.code != 200) {
      const error = new Error(result.data.message);
      error.status = result.data.code;
      next(error);
    } else {
      console.log(result.data.payload);
      res.status(200).json({
        code: 200,
      });
    }
  } catch (err) {
    console.error(err);
    next(err);
  }
};