var wpa_cli = require('wireless-tools/wpa_cli');

var state = 'DISCONNECTED';
var fs = require('fs');
// var wpa_supplicant_dir = __dirname + '/wpa.conf';
var wpa_supplicant_dir = "/etc/wpa_supplicant/wpa_supplicant.conf"
var template = `ctrl_interface=DIR=/var/run/wpa_supplicant GROUP=netdev
update_config=1
country=GB
`
var interface = require('../args/config.js').interface;
const {
    execSync
} = require('child_process');


function ScanWifi() {
    return new Promise((resolve, reject) => {
        wpa_cli.scan(interface, function (err, data) {
            wpa_cli.scan_results(interface, function (err, data) {
                if (err){
                    reject(err.message);
                    return;
                } 
                resolve(data);
            })
        });
    });
}

function CurrentWifi(){
    return new Promise( (resolve, reject)=>{
        wpa_cli.status(interface, function(err, status) {
            if (err) {
                reject(err.message);
                return;
            }
            console.log(status);
            if(status.wpa_state == 'COMPLETED'){
                resolve(status);
            }
            else{
                reject(status);
            }
        });
    })
}

function Connect(wifi) {
    /*
        {ssid: '...', psk: '...'}
    */
    //create wpa.conf
    try{
        Disconnet();
        fs.writeFileSync(wpa_supplicant_dir, template);
        var cmd = 'wpa_passphrase "' + wifi.ssid + '" "' + wifi.psk + '"';
        var stdout = execSync(cmd).toString();
        fs.appendFileSync(wpa_supplicant_dir, stdout);
        stdout = execSync('wpa_cli -i wlan0 reconfigure');
        returnCheckStatus();
    }
    catch(e){
        return CheckStatus();
    }
}

function Disconnet() {
    fs.writeFileSync(wpa_supplicant_dir, template);
    stdout = execSync('wpa_cli -i wlan0 reconfigure');
    return stdout;
}

function CheckStatus(){
    return new Promise( (resolve, reject)=>{
        setTimeout( ()=>{
            wpa_cli.status(interface, function (err, status) {
                if(err){
                    console.log(err);
                    reject(err);
                    return;
                }
                console.log(status);
                if(status.wpa_state == 'COMPLETED'){
                    resolve(status);
                }
                else{
                    reject(status);
                }
            });
        },5000);
    });
}



module.exports = {
    ScanWifi,
    CurrentWifi,
    Connect,
    Disconnet
}