var interface = 'enp0s25';
var mac = null;

function getMac() {
    return new Promise((resolve, reject) => {
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