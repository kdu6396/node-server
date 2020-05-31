const Post = require('../models/post')


exports.save = async (req,res)=> {
    const {_id} = req.decoded;
    console.log(req.decoded);
    try {
        const post = await Post.createPost(req.body,_id);
        res.status(200).json({
            "message" : "Save post successfully"
        });
    } catch (err){
        console.log(err);
        res.json({
            "message" : "board save failed"
        })
    }
}

exports.getAll = async (req,res)=> {
    try {
        const posts = await Post.findAllPosts();
        res.send(posts);
    } catch (err){
        console.log(err);//DB 조회 실패시 상태코드는 무엇인가..
        res.status(407).json({

        })
    }
}