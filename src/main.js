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
    var firebase = require('./online/firebase');
    serial.Initialize();

    var mcu = require('./mcu/mcu');
    mcu.SetSerialPort(serial);

    if(!config.production){
        var demo = require('./mcu/demo');
        demo.Initialize(mcu);
    }
    
    mcu.Subject.GetSensorsSubject.subscribe( sensors =>{
        ws.io.to('0x01').emit('SENSORS', sensors);
        ws.io.to('0x01').emit('DATETIME', mcu.GetStatus().datetime);
        ws.io.to('0x01').emit('MEMORY', mcu.GetStatus().freeMemory);
        ws.io.to('0x01').emit('GPIO', mcu.GetStatus().gpio);
        ws.io.to('0x01').emit('WATER_PROCESS', mcu.GetStatus().waterStatus);
        ws.io.to('0x01').emit('CO2_STATUS', mcu.GetStatus().co2Status);
        ws.io.to('0x01').emit('EC_STATUS', mcu.GetStatus().ecStatus);
        ws.io.to('0x01').emit('PH_STATUS', mcu.GetStatus().phStatus);
    });
    setInterval( ()=>{
        firebase.UpdateSensors(mcu.GetSensors());
        firebase.UpdateControl({
            control: mcu.GetControl(),
            water: mcu.GetWaterControl()
        });
        firebase.UpdateMcuStatus({
            water: mcu.GetStatus().waterStatus,
            co2: mcu.GetStatus().co2Status,
            ec: mcu.GetStatus().ecStatus,
            ph: mcu.GetStatus().phStatus,
            gpio: mcu.GetStatus().gpio
        });
    },2000);

    var logger = require('./datalogger/datalogger');
    logger.Initialize(mcu,config);

    ws.http.listen(ws.port, function () {
        console.log('[Info] listening *:' + ws.port);
    });
}