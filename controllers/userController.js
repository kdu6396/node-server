const User = require('../models/user.js')
const jwt = require('jsonwebtoken')


exports.register = (req,res)=>{
    const {userId, password} = req.body;
    let newUser = null;
    const create = (user) => {
        if(user) {
            throw new Error('id exists')
        } else {
            return User.create(userId, password)
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
    User.findOneByUserId(userId).then(create).then(count)
    .then(assign).then(respond).catch(onError);
};

exports.login =(req,res,next)=>{
    const {userId,password} = req.body
    const ip_addr = req.headers['x-forwarded-for'] || req.connection.remoteAddre                                                                                                             ss
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
                        ip_addr : ip_addr,
                        admin : user.admin
                    },
                    secret,
                    {
                        expiresIn :'7d',
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

    User.findOneByUserId(userId).then(check).then(respond).catch(onError);
}


