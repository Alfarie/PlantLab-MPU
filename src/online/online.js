var Rx = require('rxjs');

var Connection = new Rx.Subject();
var state = 'undefined';

function CheckConection() {
    return new Promise((resolve, reject) => {
        require('dns').resolve('www.google.com', function (err) {
            if (err) {
                reject('disconnected');
            } else {
                resolve('connected');
            }
        });
    });
}

var loop = setInterval( ()=>{
    CheckConection().then(
        status=>{
            if(state != status){
                Connection.next(status);
                state = status;
            }
        }
    )
    .catch(
        status=>{
            if(state != status){
                Connection.next(status);
                state = status;
            }
        }
    )
},1000);

function GetState(){
    return state;
}

module.exports = {
    CheckConection,
    Connection,
    GetState
}