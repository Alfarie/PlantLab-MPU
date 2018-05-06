var express = require('express');
var router = express.Router();
var SendDateTime = require('../../mcu/mcu').SendDateTime;
var activity = require('../../mpu-store/activity.js');
var wifi = require('../../wifi/wifi');
router.post('/datetime', function (req, res) {
    SendDateTime(req.body);
    res.json({
        msg: 'success'
    })
});

router.get('/plants', function (req, res) {
    res.json(activity.plant);
})

router.post('/activity', function (req, res) {
    activity.SaveActivity(req.body);
    res.json({
        msg: 'success'
    })
});

router.get('/activity', function (req, res) {
    res.json(activity.GetActivity());
});

router.get('/wifi/scan', function (req, res) {
    wifi.ScanWifi()
    .then(data => {
        res.json({msg: 'success', data: data});
    })
    .catch(err=>{
        res.json({msg: 'failure', data: err });
    })
});

router.get('/wifi/current',function (req, res) {
    wifi.CurrentWifi()
        .then(data => {
            res.json({msg: 'success', data: data});
        })
        .catch(err=>{
            res.json({msg: 'failure', data: err });
        })
})

router.get('/wifi/disconnect', function(req,res){
    var std = wifi.Disconnet();
    res.json({msg: 'success', data: std})
});

router.post('/wifi/connect', function(req,res){
    wifi.Connect(req.body).then( status =>{
        res.json({msg: 'success', data: status})
    }).catch(
        err=>{
            res.json({msg: 'fail', data: err})
        }
    )
})

module.exports = router;