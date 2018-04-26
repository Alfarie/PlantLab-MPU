var express = require('express');
var router = express.Router();
var GetControl   = require('../../mcu/mcu').GetControl;
var GetWaterControl   = require('../../mcu/mcu').GetWaterControl;
var SendCommand  = require('../../mcu/mcu').SendCommand;
var SendWater =  require('../../mcu/mcu').SendWaterProcess;

router.get('/', function(req,res){
    console.log('[Info] Control API: Request');
    var control = GetControl();
    res.json(control);
});



router.post('/', function(req,res){
    console.log(req.body);
    SendCommand(req.body.control);
    res.json({msg: 'successfull'})
});

router.get('/water', (req,res)=>{
    var waterCtrl = GetWaterControl();
    res.json(waterCtrl);
});

router.post('/water', (req,res)=>{
   console.log(req.body);
   SendWater(req.body);
   res.json({msg: 'successfull'})
});

module.exports = router;