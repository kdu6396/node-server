const Post = require('../models/post')


exports.save = async (req,res)=> {
    const {_id} = req.decoded;
    console.log(req.decoded);
    try {
        const post = await Post.createPost(req.body,_id);
        res.status(200).json({
            "message" : "Save post successfully",
            "post_id" : post._id
        });
    } catch (err){
        res.json({
            "message" : err.message
        })
    }
}

exports.getAll = async (req,res)=> {
    try {
        const posts = await Post.findAllPosts();
        res.status(200).send(posts);
    } catch (err){
        console.log(err);//DB 조회 실패시 상태코드는 무엇인가..
        res.status(407).json({
            "message" : "Fetch post failed"
        })
    }
}

exports.delete = async (req,res) => {
    const {post_id} = req.body;
    try {
        const post = await Post.deletePost(post_id);
        if(post.deletedCount===1){
            res.status(200).json({
                "message" : "Delete post successfully"
            });
        }
        throw new Error('cannot match post id');
    } catch (err){
        res.status(407).json({
            "message": err.message
        })
    }
}


exports.update = async (req,res) => {
    try {
        const post = await Post.updatePost(req.body);
        console.log(post);
        if(post.nModified){
            res.status(200).json({
                "message" : "Update post successfully"
            });
        }
        throw new Error('cannot match post id');
    } catch (err){
        console.log(err);
        res.status(407).json({
            "message": err.message
        })
    }
}