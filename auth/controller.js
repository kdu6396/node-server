const User = require('../user.js')
const jwt = require('jsonwebtoken')

exports.register = (req,res)=>{
    const {username, password} = req.body;
    let newUser = null;
    const create = (user) => {
        if(user) {
            throw new Error('username exists')
        } else {
            return User.create(username, password)
        }
    }

    // count the number of the user
    const count = (user) => {
        newUser = user
        return User.countDocuments({}).exec()
    }
    const assign = (count)=>{
        if(count===1){
            return newUser.assignAdmin();
        } else {
            return Promise.resolve(false);
        }
    }

    const respond = (isAdmin) =>{
        res.json({
            message:'registered successfully',
            admin : isAdmin ? true : false
        })
    }

    const onError = (error) =>{
        res.status(409).json({
            message:error.message
        })
    }
    User.findOneByUsername(username).then(create).then(count)
    .then(assign).then(respond).catch(onError);
};

exports.login =(req,res,next)=>{
    const {username,password} = req.body
    const secret = req.app.get('jwt-secret');

    const check = (user)=>{
        if(!user){
            throw new Error('login failed')
        } else {
            if(user.verify(password)) {
                return new Promise((resolve, reject)=>{
                    jwt.sign({
                        _id : user._id,
                        username : user.username,
                        admin : user.admin
                    },
                    secret,
                    {
                        expiresIn :'60s',
                        issuer : 'LDJ',
                        subject : 'userInfo'
                    },(err,token)=>{
                        if(err) reject(err);
                        resolve(token);
                    });
                })
                
            } else {
                throw new Error('login failed');
            }
        }
        
    }

    const respond = (token)=>{
        res.json({
            message: 'logged in successfully',
            token
        })
    }

    const onError = (error)=>{
        res.status(403).json({
            message:error.message
        })
    }

    User.findOneByUsername(username).then(check).then(respond).catch(onError);
}

exports.check = (req, res) => {
    // read the token from header or url 
    const token = req.headers['x-access-token'] || req.query.token

    // token does not exist
    if(!token) {
        return res.status(403).json({
            success: false,
            message: 'not logged in'
        })
    }

    // create a promise that decodes the token
    const p = new Promise(
        (resolve, reject) => {
            jwt.verify(token, req.app.get('jwt-secret'), (err, decoded) => {
                if(err) reject(err)
                resolve(decoded)
            })
        }
    )

    // if token is valid, it will respond with its info
    const respond = (token) => {
        res.json({
            success: true,
            info: token
        })
    }

    // if it has failed to verify, it will return an error message
    const onError = (error) => {
        res.status(403).json({
            success: false,
            message: error.message
        })
    }

    // process the promise
    p.then(respond).catch(onError);
    next();
}

exports.insert = async (req,res)=>{
    
    const user = await User.postPost(req.body);
    if(user.nModified===1){
        res.status(200).json({
            message: "post successfully"
        })
    } else {
        res.status(409).json({
            message: "username not found"
        })
    }
    
}