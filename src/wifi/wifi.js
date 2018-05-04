var wpa_cli = require('wireless-tools/wpa_cli');
var wpa_supplicant = require('wireless-tools/wpa_supplicant');


function ScanWifi() {
    return new Promise((resolve, reject) => {
        wpa_cli.scan('wlp3s0', function (err, data) {
            wpa_cli.scan_results('wlp3s0', function (err, data) {
                if (err) reject(err.message);
                resolve(data);
            })
        });
    });
}

module.exports = {
    ScanWifi
}