var express = require('express');
var router = express.Router();
var SendDateTime = require('../../mcu/mcu').SendDateTime;
var activity = require('../../mpu-store/activity.js');

router.post('/datetime', function(req,res){
    SendDateTime(req.body);
    res.json({msg: 'success'})
});

router.get('/plants', function(req,res){
    res.json(activity.plant);
})

router.post('/activity', function(req,res){
    activity.SaveActivity(req.body);
    res.json({msg: 'success'})
})
router.get('/activity', function(req,res){
    
    res.json(activity.GetActivity());
})



module.exports = router;