const {Post, Hashtag}=require('../models');

exports.afterUploadImage=(req, res)=>{
  console.log(req.file);
  res.json({url:`/img/${req.file.filename}`});
};

exports.uploadPost  =async(req, res, next)=>{
  try{
    const post = await Post.create({
      content:req.body.content,
      img:req.body.url,
      UserId:req.user.id,
    });

    const hashtags = req.body.content.match(/#[^\s#]*/g);
    if(hashtags){
      const result = await Promise.all(
        hashtags.map(tag=>{
          return Hashtag.findOrCreate({
            where:{title:tag.slice(1).toLowerCase()},
          })
        }),
      );
      await post.addHashtags(result.map(r=>r[0]));
    }
    res.redirect('/');
  }catch(error){
    console.error(error);
    next(error)
  }
}

exports.updatePost = async(req, res) => {
  console.log(req.params.id);
 
  try {
    const updatePost = await Post.update(
      {content : req.body.content}
      ,{where : {id:req.params.id}}
      )
    console.log("post",updatePost);
    res.redirect("/")
  } catch (error) {
    console.log(error);
  }
}

exports.deletePost=async(req, res, next)=>{
  try{
    const post = await Post.findOne({where:{id:req.body.id}});
    if(post){
      await post.destroy(parseInt(req.body.id, 10));
      res.send('sussess');
      // res.redirect(303,"/")
    }else{
      res.status(404).send('no post');
    }
  }catch(error){
    console.error(error);
    next(error);
  }
}