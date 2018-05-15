var getMac = require('./getmac').getMac;
var logger = require('../datalogger/datalogger');
var mid = null;

function Init(db){
    getMac().then(mac => {
        mid = mac;
        db.ref('/dbs/' + mid + '/day').set('NULL')
        db.ref('/dbs/' + mid + '/db').set('NULL')
    
        db.ref('/dbs/' + mid + '/day').on('value', (snap) => {
            var day = snap.val();
            if (day.startsWith("DATE")) {
                logger.GetLoggerByDate(day).then(data => {
                    if (data.length == 0) {
                        db.ref('/dbs/' + mid + '/db').set('NULL')
                    } else {
                        db.ref('/dbs/' + mid + '/db').set(data)
                    }
                })
            } else {
                db.ref('/dbs/' + mid + '/db').set('NULL')
            }
        });
    })
}


module.exports = {
    Init
}