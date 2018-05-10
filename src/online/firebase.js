global.XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
const firebase = require('firebase');
require("firebase/auth");
require("firebase/database");
var getMac = require('./getmac').getMac;
var Connection = require('./online').Connection;
var CheckConection = require('./online').CheckConection;

var GetLocation = require('./location').GetLocation;
var GetIP = require('./public-ip').GetIP;

var config = {
    apiKey: "AIzaSyCAgI7nnd_D-33iQb2XmKvcrHDK9Wn9LPE",
    authDomain: "plant-lab.firebaseapp.com",
    databaseURL: "https://plant-lab.firebaseio.com",
    projectId: "plant-lab",
    storageBucket: "plant-lab.appspot.com",
    messagingSenderId: "1075312033795"
};
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
    CheckConection()
        .then(getMac)
        .then(CreateUser)
        .then(SignIn)
        .then(data => {
            getMac().then(mac => {
                let root = '/mids/' + mac;
                db.ref( root + '/matchineId').set(mac);
                GetIP().then(ip => {
                    db.ref(root + '/ip').set(ip);
                })
                GetIP().then(GetLocation).then(local=>{
                        db.ref(root + '/local').set(local);
                    }
                )
            })

        })
        .catch(err => {
            console.log(err);
        })
}
Connection.asObservable().subscribe(data => {
    if (data == 'connected') {
        Init();
    }
})
// Init();