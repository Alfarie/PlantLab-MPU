var controlModel = require('./models/control');
var sensorModel = require('./models/sensors');
var statusModel = require('./models/status');
var config = require('../args/config');
var CmdProcess = require('./cmdprocessing');

var serialport;
var read, write;
var commands;
var realTimeRequestLoop;

var Rx = require('rxjs');
var GetSensorsSubject = new Rx.Subject();
var McuUpdated = new Rx.Subject();

function GetControl() {
    return controlModel.control;
}

function GetWaterControl() {
    return controlModel.waterControl;
}

function GetCalibration() {
    return controlModel.calibration;
}


function GetSensors() {
    return sensorModel.sensors;
}

function GetStatus() {
    return statusModel;
}

function RequestRealTimeData(cmd) {
    if (cmd) {
        realTimeRequestLoop = setInterval(() => {
            write.next('{Gsensors}')
            write.next('{Gdatetime}')
            write.next('{Ggpio}')
            write.next('{Gwater-status}')
            write.next('{Gco2-status}')
            write.next('{Gec-status}')
            write.next('{Gph-status}')
        }, 1000);
    } else {
        clearInterval(realTimeRequestLoop);
    }
}

function RequestControlSequence() {
    console.log('[Info] Requesting: control');
    write.next('{Gcontrol,channelstatus,1,6}');
    write.next('{Gcontrol,timer,1,1}{Gcontrol,timer,5,1}'); //led, water-timer
    write.next('{Gcontrol,setbound,2,1}'); //co2
    write.next('{Gcontrol,setpoint,3,2}'); //ec,ph
    write.next('{Gwater-control}')
    write.next('{getcal}')
    write.next('{done}')
}

function SetSerialPort(serial) {
    serialport = serial;
    read = serial.read;
    write = serial.write;

    serial.onConnect.subscribe(data => {

        /*console.log("[Info] Mcu checking status...");
        write.next("{checkstatus}");*/
    });

    serial.onDisconnect.subscribe(data => {
        console.log('[Info] Serial Port disconencted');
        console.log('[Info] Requesting data from mcu: cleared');
        RequestRealTimeData(false);
    })

    read.subscribe(data => {
        CommandVerify(data);
    });
}

//check is json format or plaintext
function CommandVerify(cmd) {


    if (cmd == 'RDY') {
        //Initialization Part
        console.log('[Info] Mcu status: RDY!');
        setTimeout(() => {
            RequestControlSequence();
            RequestRealTimeData(true);
        }, 2000);

    } else if (cmd.startsWith("INFO")) {
        let str = cmd.replace('INFO', '');
        console.log('[Info] Mcu board info: ', str);
    } else if (cmd.startsWith('UPD')) {
        var resarr = cmd.split('-');
        var type = resarr[1];
        var ch = (resarr.length > 2) ? resarr[2] : null;
        if (type == 'WATER') write.next('{Gwater-control}');
        else if (type == 'SETPOINT') write.next('{Gcontrol,setpoint,' + ch + ',1}');
        else if (type == 'SETBOUND') write.next('{Gcontrol,setbound,' + ch + ',1}');
        else if (type == 'TIMER') write.next('{Gcontrol,timer,' + ch + ',1}');
        else if (type == 'MANUAL') write.next('{Gcontrol,manual,' + ch + ',1}');
        else if (type == 'SETCAL') write.next('{getcal}');
        if (ch) write.next('{Gcontrol,channelstatus,' + ch + ',1}');
        
    } else if (cmd == 'DONE') {
        console.log('[Info] Mcu status: REQUESTING DONE!');
        McuUpdated.next(true);
    }
    // if cmd is not json format
    else {
        var cmdarr = CmdProcess.SplitCommand(cmd);
        cmdarr.forEach(cmd => {
            var jsonCmd = CmdProcess.ExtractCommand(cmd);
            if (jsonCmd) {
                if (jsonCmd.header == 'sensors')
                    GetSensorsSubject.next(jsonCmd.data);
            } else {
                console.log('[Warning] Unknown incoming data:', cmd);
            }
        });
    }
    serialport.setState('done');
}


//use by control-api.js
function SendCommand(chData) {
    var ch = chData.ch;
    var mode = chData.mode;
    var strmcd = "";
    if (mode == 0) {
        strcmd = "{manual," + ch + "," + chData.manual.status + "}";
    } else if (mode == 1) {
        // {timer,1,1,20-60,90-150,200-260}
        let list = chData.timer.list;
        let strlist = []
        strcmd = "{timer," + ch + "," + chData.timer.mode + ",";
        list.forEach(l => {
            strlist.push(l.join('-'))
        });
        strcmd += strlist.join(',');
        strcmd += "}";
    } else if (mode == 2) {
        //{setpoint,channel,setpoint_value, working, detecting, sensor}
        let setpoint = chData.setpoint;
        strcmd = "{setpoint," + ch + "," + setpoint.setpoint + "," + setpoint.working + "," + setpoint.detecting + "," + chData.sensor + "}"
    } else if (mode == 3) {
        let setbound = chData.setbound;
        // {setbound, channel, upper,lower,sensor}
        strcmd = "{setbound," + ch + "," + setbound.upper + "," + setbound.lower + "," + chData.sensor + "}";
    } else if (mode == 4) {
        //{irrigation,ch, irr_mode,soil_up, soil_low, par_acc}
        let irr = chData.irrigation;
        strcmd = "{irrigation," + ch + "," + irr.mode + "," + irr.soil_upper + "," + irr.soil_lower + "," + irr.par_accum + "," + irr.working + "}";
    } else if (mode == 5) {
        strcmd = "{mode," + ch + "," + mode + "}";
    }
    console.log(strcmd);
    write.next(strcmd);
}

function SendDateTime(datetime) {
    /*
        dt: {date: "2017-01-01", time: "10:46"}
    */
    var date = datetime.date.split('-');
    var time = datetime.time.split(':');
    var payload = {
        day: parseInt(date[2]),
        month: parseInt(date[1]),
        year: parseInt(date[0]) % 2000,
        hour: parseInt(time[0]),
        min: parseInt(time[1])
    }

    let strcmd = '{datetime,' + payload.day + ',' +
        payload.month + ',' +
        payload.year + ',' +
        payload.hour + ',' +
        payload.min + '}';
    console.log(strcmd);
    write.next(strcmd);
}

function SendWaterProcess(control) {
    /*
        {
            isCir: true,
            isFill: true,
            cirTime: 900,
            waitingTime: 900
        }
    */
    var data = control.control
    var isCir = (data.isCir) ? 1 : 0;
    var isFill = (data.isFill) ? 1 : 0;
    var cirTime = data.cirTime;
    var waitingTime = data.waitTime;
    var strcmd = "{waterprocess," + isCir + "," + isFill + "," + data.cirTime + "," + data.waitTime + "}";
    console.log(strcmd);
    write.next(strcmd);
}

function SendCalibration(cal) {
    var strcmd = "{setcal," + cal.ec + "," + cal.ph + "}";
    console.log(strcmd);
    write.next(strcmd);
}

module.exports = {
    SetSerialPort,
    GetControl,
    GetWaterControl,
    GetCalibration,
    GetSensors,
    GetStatus,
    SendCommand,
    SendWaterProcess,
    SendCalibration,
    SendDateTime,
    Subject: {
        GetSensorsSubject,
        McuUpdated
    }
}



// function ExecJsonCommand(json) {
//     console.log('json command' + json + '--------------------------------------------------------------------');
//     var type = json.type;
//     var data = json.data;
//     // control setting format: 'control-[type]'
//     if (type.startsWith('control')) {
//         /*
//             split 'contorl-[type]' to only [type]
//             ct: control type [manual, timer, setpoint, setbound, irrigation]
//         */
//         let ct = type.split('-')[1];
//         data.forEach((chdata, ind) => {
//             let ch = ind + 1;
//             let d = data[ind];
//             controlModel.control[ind][ct] = d[ct];
//         })
//         console.log('[Info] Recieved: ' + type);
//     } else if (type == 'channel-status') {
//         data.forEach((d, ind) => {
//             controlModel.control[ind].ch = ind + 1;
//             controlModel.control[ind].mode = d.mode;
//             controlModel.control[ind].sensor = d.sensor;
//             statusModel.gpio[ind] = d.status;
//         })
//     } else if (type == 'sensors') {
//         /*
//         data: json sensors object from mcu
//         */

//         sensorModel.sensors = data;
//         GetSensorsSubject.next(data);
//     } else if (type == 'channel-paracc') {
//         /*
//             data:  Array(4) [Object, Object, Object, Object]
//                         acc:0
//                         isuse:0
//                         max:1500000
//                         mode:0
//         */
//         statusModel.paracc = data;
//     } else if (type == 'free-memory') {
//         statusModel.freeMemory = data;
//     } else if (type.startsWith('waterprocess')) {
//         statusModel.waterStatus = json;
//     } else if (type.startsWith('water-control')) {
//         console.log('[Info] Recieved: control-water');
//         controlModel.waterControl = data;
//     } else if (type == 'co2-status') {
//         statusModel.co2Status = data;
//     } else if (type == 'ec-status') {
//         statusModel.ecStatus = data;
//     } else if (type == 'ph-status') {
//         statusModel.phStatus = data;
//     } else if (type == 'calibration') {
//         console.log('[Info] Recieved: calibration');
//         controlModel.calibration = data;
//     }
// }