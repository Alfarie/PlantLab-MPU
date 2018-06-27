var args = require('./args/processing');
var exit = false;
process.argv.forEach(function (val, index, array) {
    console.log(index + ': ' + val);
    if (!args.argProcess(val)) {
        exit = true;
    }
});

if (!exit) {
    var ws = require('./ws/ws');
    var config = require('./args/config');
    var serial = require('./serial/serial');
    var online = require('./online/online');
    var memory = require('./memory/memory');
    var awsIot = require('./online/aws-iot.js');
    var getMac = require('./online/mac');
    var moment = require('moment');
    serial.Initialize();

    var mcu = require('./mcu/mcu');
    mcu.SetSerialPort(serial);

    if (!config.production) {
        var demo = require('./mcu/demo');
        demo.Initialize(mcu);
    }

    mcu.Subject.GetSensorsSubject.subscribe(sensors => {
        ws.io.to('0x01').emit('SENSORS', sensors);
        ws.io.to('0x01').emit('DATETIME', mcu.GetStatus().datetime);
        ws.io.to('0x01').emit('CONNECTION', online.GetStateBoolean());
        ws.io.to('0x01').emit('MEMORY', mcu.GetStatus().freeMemory);
        ws.io.to('0x01').emit('GPIO', mcu.GetStatus().gpio);
        ws.io.to('0x01').emit('WATER_PROCESS', mcu.GetStatus().waterStatus);
        ws.io.to('0x01').emit('CO2_STATUS', mcu.GetStatus().co2Status);
        ws.io.to('0x01').emit('EC_STATUS', mcu.GetStatus().ecStatus);
        ws.io.to('0x01').emit('PH_STATUS', mcu.GetStatus().phStatus);
    });

    setInterval(() => {
        if (mcu.GetSensors() != {}) {
            var sensor = mcu.GetSensors();
            var data = {
                mid: getMac.mac,
                timestamp: new Date().getTime(),
                date: moment().format('YYYY-MM-DD'),
                time: moment().format('HH:mm:ss'),
                ph: sensor.ph,
                ec: sensor.ec,
                water: sensor.water,
                co2: sensor.co2,
                temperature: sensor.temperature,
                humidity: sensor.humidity,
                floating: sensor.floating
            }
            awsIot.publish('iot:sensors/log/' + getMac.mac, data)
        }

    }, 5000);

    var logger = require('./datalogger/datalogger');
    logger.Initialize(mcu, config);

    ws.http.listen(ws.port, function () {
        console.log('[Info] listening *:' + ws.port);
    });
}