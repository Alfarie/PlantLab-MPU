var firebase = require("firebase");
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
