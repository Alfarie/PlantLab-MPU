var express = require('express');
var router = express.Router();
var fs = require('fs');
var tokenHandler = require('./tokenHandler');

var authData = JSON.parse(fs.readFileSync(__dirname + '/auth.json').toString());

router.post('/signin', function(req,res){
    /*
        {
            username: ....,
            password: ....
        }
    */
   var ad = req.body;
   console.log(ad);
   if(authData.username == ad.username && authData.password == ad.password){
        var tokenId = tokenHandler.sign(authData)
        res.json({
            username: authData.username,
            tokenId: tokenId,
            message: 'Authentication Successful',
            success: true,
            expiresIn: 600
        })
   }else{
       res.json( {
           success: false,
           message: 'Authentication Fail'
       })
   }
});

router.post('/passwd', function(req,res){
    /*
        {
            username: ....,
            password: ....
        }
    */
    var ad = req.body;
    fs.writeFile(__dirname + '/auth.json', JSON.stringify(ad), (err,res)=>{
        if(err){
            res.json({
                success: true,
                message: 'New password is saved!'
            })
        }
        res.json({
            success: true,
            message: 'New password is saved!'
        })
    })
});



module.exports = router;