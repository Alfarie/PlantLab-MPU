var express = require('express');
var router = express.Router();
var SendDateTime = require('../../mcu/mcu').SendDateTime;

router.post('/datetime', function(req,res){
    SendDateTime(req.body);
    res.json({msg: 'success'})
});

module.exports = router;