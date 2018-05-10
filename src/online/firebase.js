global.XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
const firebase = require('firebase');
require("firebase/auth");
require("firebase/database");
var getMac = require('./getmac').getMac;
// var Connection = require('./online').Connection;
// var CheckConection = require('./online').CheckConection;
var online = require('./online');


var GetLocation = require('./location').GetLocation;
var GetIP = require('./public-ip').GetIP;


firebase.initializeApp(config);

var db = firebase.database();
var auth = firebase.auth();

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
                let root = '/mids/' + mac;
                db.ref( root + '/matchineId').set(mac);
                GetIP().then(ip => {
                    db.ref(root + '/ip').set(ip);
                    GetLocation(ip).then(local=> db.ref(root + '/local').set(local));
                })
            })
        })
        .catch(err => {
            console.log(err);
        })
}
online.Connection.asObservable().subscribe(data => {
    if (data == 'connected') {
        Init();
    }
})

function UpdateAllData(){
    online.CheckConection().then(data=>{
        console.log('update all data');
    })
}

setInterval(UpdateAllData, 1000);