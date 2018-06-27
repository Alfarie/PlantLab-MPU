var awsIot = require('aws-iot-device-sdk');
var device = awsIot.device({
   keyPath:  __dirname + '/cert/private.pem.key',
  certPath: __dirname + '/cert/certificate.pem.crt',
    caPath: __dirname + '/cert/root-CA.crt',
      host: 'a36i6p8e4cz1dq.iot.ap-southeast-1.amazonaws.com'
});

device
  .on('connect', function() {
    console.log('[Info] AWS-IOT Connected');
});

var publish = function(topic, data){
    device.publish(topic, JSON.stringify(data));
}

module.exports = {
    publish
}