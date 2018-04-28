var express = require('express');
var router = express.Router();
var GetControl   = require('../../mcu/mcu').GetControl;
var GetCalibration   = require('../../mcu/mcu').GetCalibration;
var GetWaterControl   = require('../../mcu/mcu').GetWaterControl;

var SendCommand  = require('../../mcu/mcu').SendCommand;
var SendWater =  require('../../mcu/mcu').SendWaterProcess;
var SendCalibration = require('../../mcu/mcu').SendCalibration;

router.get('/', function(req,res){
    console.log('[Info] Control API: Request');
    var control = GetControl();
    res.json(control);
});

router.post('/', function(req,res){
    // console.log(req.body);
    SendCommand(req.body.control);
    res.json({msg: 'success'})
});

router.get('/calibration', (req,res)=>{
    var cal = GetCalibration();
    res.json(cal);
});
router.post('/calibration', (req,res)=>{
    SendCalibration(req.body);
    res.json({msg: 'success'})
});


router.get('/water', (req,res)=>{
    var waterCtrl = GetWaterControl();
    res.json(waterCtrl);
});

router.post('/water', (req,res)=>{
//    console.log(req.body);
   SendWater(req.body);
   res.json({msg: 'success'})
});

module.exports = router;