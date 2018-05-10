
var interface = require('../args/config.js').interface;
var mac = null;

function getMac() {
    return new Promise((resolve, reject) => {
        console.log('[Info] Get MAC: from ' + interface);
        require('getmac').getMac({iface: interface}, function (err, macAddress) {
            if (err) throw err
            mac = macAddress.split(":").join('')
            resolve(macAddress.split(":").join(''));
        });
    })
}

module.exports = {
    getMac,
    mac
}