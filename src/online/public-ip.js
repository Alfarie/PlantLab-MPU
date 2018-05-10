var publicIp = require('public-ip');

function GetIP() {
    return new Promise((resolve, reject) => {
        publicIp.v4()
            .then(ip => {
                resolve(ip);
            })
            .catch(err => {
                reject('network disconnected');
            })
    });
}

module.exports = {
    GetIP
}