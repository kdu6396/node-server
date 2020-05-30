var express = require('express');
var router = express.Router();
const User = require('../user.js')
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
  const {id}  = req.query;
  console.log(id)
}).get('/:name', function(req, res, next) {

  User.find({name:req.params.name}, (err,user)=>{
    console.log(user);
  })
  res.send();
});

router.post('/',(req,res)=>{
  const {name,age} = req.body;
  var userModel = new User();
  userModel.name = name;
  userModel.age = age;
  userModel.save().then(newUser=>{
    console.log("Create 완료");
    res.status(200).json({
      message:"Create success",
      data: {
        user:newUser,
      }
    });
  })
  .catch(err=>{
    res.status(500).json({
      message:err
    });
  });

});
router.delete('/:name', (req,res)=>{
  User.deleteOne({name: req.params.name},()=>console.log("abc"));//콜백이 있어야 완성이되네?
  res.send();
})


module.exports = router;
