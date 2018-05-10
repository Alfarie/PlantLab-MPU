var where = require('node-where');

function GetLocation(ip) {
    return new Promise((resolve, reject) => {
        where.is(ip, (err, result) => {
            if (err) {
                reject(err);
            }
            if (result) {
                // console.log('City: ' + result.get('city'));
                // console.log('State / Region: ' + result.get('region'));
                // console.log('State / Region Code: ' + result.get('regionCode'));
                // console.log('Zip: ' + result.get('postalCode'));
                // console.log('Country: ' + result.get('country'));
                // console.log('Country Code: ' + result.get('countryCode'));
                // console.log('Lat: ' + result.get('lat'));
                // console.log('Lng: ' + result.get('lat'));
                resolve(result);
            }
        });
    })
}

module.exports = {
    GetLocation
}