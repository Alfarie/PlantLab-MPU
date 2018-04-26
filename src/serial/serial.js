/*
    ---Serial Module---
    Dependencies :
        - serialport
        - rxjs

    Author: Farhan Poharsae
*/
try {
    var config = require('../args/config');
    var portName = config.serialPort;
    var production = config.production;
} catch (ex) {
    console.log('[Exception] [Serial Module] Config file not found: self initializing.');
    var portName = '/dev/ttyACM1'
    var production = false;
}

var fs = require('fs');
const SerialPort = require('serialport');
const Readline = SerialPort.parsers.Readline;
var RECONNECT_INTERVAL = 500;

var port = null;
var parser = null;
var isConnected = false;

var Rx = require('rxjs/Rx');
var write = new Rx.Subject();
var read = new Rx.Subject();
var onConnect = new Rx.Subject();


function Exists(file) {
    return new Promise((resolve, reject) => {
        fs.exists(file, (exists) => {
            if (exists) {
                resolve(file)
            } else {
                reject(false);
            }
        })
    })
}

function Connect(portName) {
    return new Promise((resolve, reject) => {
        port = new SerialPort(portName, {
            baudRate: 115200,
            autoOpen: false,
            disconnectedCallback: function () {
                console.log('You pulled the plug!');
            }
        });
        port.open((err) => {
            if (err) {
                console.log(err);
                reject();
            }
            else{
                resolve();
            }
        })
        parser = port.pipe(new Readline({
            delimiter: '\r\n'
        }));
        port.on('open', (err) => {
            console.log("[Info]", portName, "is Opened. ")
            isConnected = true;
        })
        port.on('close', (err) => {
            console.log(err);
            isConnected = false;
        })
        parser.on('data', (data) => {
            read.next(data);
        })
    })
}

function SerialPortConnect(file) {
    return new Promise((resolve, reject) => {
        let promise = Exists(file).then(Connect);
        promise.then(res =>{
            resolve();
        })
        .catch(res=>{
            reject();
        }) 
    })
}

function Initialize() {
    if (production) {
        setInterval(() => {
            if (!isConnected) {
                console.log('[Info] Connecting to ' + portName)
                SerialPortConnect(portName)
                    .then(() => {
                        isConnected = true;
                        setTimeout( ()=> {onConnect.next(true);}, 1000);
                    })
                    .catch( ()=>{
                        isConnected = false;
                    })
            }
        }, RECONNECT_INTERVAL);
    }
    else{
        console.log('[Info] Demonstation mode: Demo.js activated');
    }
    write.subscribe(data => {
        if (isConnected) {
            port.write(data);
        };
    });
}

module.exports = {
    write,
    read,
    onConnect,
    Initialize
}