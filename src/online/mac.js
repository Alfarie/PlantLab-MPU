
var interface = require('../args/config.js').interface;
var getmac = require('getmac');

function getMac() {
    return new Promise((resolve, reject) => {
        console.log('[Info] Get MAC: from ' + interface);
        require('getmac').getMac({ iface: interface }, function (err, macAddress) {
            if (err) throw err
            mac = macAddress.split(":").join('')
        });
    })
}

var mac = null;

function InitMac() {
    var sync = true;
    var data = null;
    var data = getmac.getMac({ iface: interface }, (err,mac)=>{
        data = mac;
        sync = false;
    });
    while(sync) {require('deasync').sleep(100);}
    return data;
}
mac = InitMac();
mac = mac.split(":").join('');
module.exports = {
    getMac,
    mac
}