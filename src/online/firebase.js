global.XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
const firebase = require('firebase');

require("firebase/auth");
require("firebase/database");
var config = require('./firebase-api').config;
var getMac = require('./getmac').getMac;
var online = require('./online');
var mid = null;
var GetLocation = require('./location').GetLocation;
var GetIP = require('./public-ip').GetIP;

firebase.initializeApp(config);

var db = firebase.database();
var auth = firebase.auth();

var firebaseDB = require('./firebase-db')

function CreateUser(username) {
    return new Promise((resolve, reject) => {
        let authData = {
            user: username + '@intelagro.com',
            pass: 'raspberry'
        }
        auth.createUserWithEmailAndPassword(authData.user, authData.pass)
            .then(data => {
                resolve(authData);
            })
            .catch(err => {
                resolve(authData);
            })
    });
}

function SignIn(authData) {
    return auth.signInWithEmailAndPassword(authData.user, authData.pass)
}

function Init() {
    online.CheckConection()
        .then(getMac)
        .then(CreateUser)
        .then(SignIn)
        .then(data => {
            console.log('[Info] Firebase connected');
            getMac().then(mac => {
                mid = mac;
                let root = '/mids/' + mac;
                db.ref(root + '/matchineId').set(mac);
                GetIP().then(ip => {
                    db.ref(root + '/ip').set(ip);
                    GetLocation(ip).then(local => db.ref(root + '/local').set(local));
                })

                firebaseDB.Init(db);
            })
        })
        .catch(err => {
            console.log(err);
        });
}

online.Connection.asObservable().subscribe(data => {
    if (data == 'connected') {
        Init();
    }
})

function UpdateSensors(sensors) {
    if (auth.currentUser) {
        let path = '/mids/' + mid + '/sensors';
        db.ref(path).set(sensors);
    }
}

function UpdateControl(control){
    if (auth.currentUser) {
        let path = '/mids/' + mid + '/control';
        db.ref(path).set(control);
    }
}
function UpdateMcuStatus(mcu){
    if (auth.currentUser) {
        let path = '/mids/' + mid + '/mcu-status';
        db.ref(path).set(mcu);
    }
}


module.exports = {
    UpdateSensors,
    UpdateControl,
    UpdateMcuStatus,
    db
}