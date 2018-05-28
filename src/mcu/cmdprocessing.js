var model = require('./models/model');
var sensorsModel = require('./models/sensors');
var statusModel = require('./models/status');
var controlModel = require('./models/control');


function Update(data) {
    var header = data.header;
    var data = data.data;
    if (header == 'sensors') {
        sensorsModel.sensors = data;
    } else if (header == 'datetime') {
        statusModel.datetime = data;
    }
}

function CommandVerify(cmd) {
    var match = cmd.match(/\{[\w\,\-\.\:\[\]]+\}/);
    if (match != null) return true;
    else return false;
}

function ReplaceAll(str, search, replacement) {
    var target = str;
    return target.replace(new RegExp(search, 'g'), replacement);
}

function SplitCommand(cmd) {
    cmd = ReplaceAll(cmd, '{', '');
    cmd = cmd.split('}');
    cmd.splice(cmd.length - 1, 1);
    return cmd;
}

function ExtractCommand(cmd) {
    if (CommandVerify('{' + cmd + '}')) {
        var cmdarr = cmd.split(',');
        var header = cmdarr[0].split('-');
        cmdarr.splice(0, 1);
        var craftedJson = {};
        if (header[0] == 'st') craftedJson = StatusCraft(header, cmdarr);
        else if (header[0] == 'ct') craftedJson = ControlCraft(header, cmdarr);
        else if (header[0] == 'se') craftedJson = SettingCraft(header, cmdarr);
        Update(craftedJson);
        return craftedJson;
    } else return null;
}

function StatusCraft(header, cmdarr) {
    var craftedJson = {}
    if (header[1] == 'sensors') {
        cmdarr = cmdarr.map(Number);
        let keys = Object.keys(model.sensors);
        keys.forEach((key, ind) => {
            craftedJson[key] = cmdarr[ind]
        });
    } else if (header[1] == 'datetime') {
        let keys = Object.keys(model.datetime);
        keys.forEach((key, ind) => {
            craftedJson[key] = cmdarr[ind]
        });
    }
    else if(header[1] == 'gpio'){
        statusModel.gpio = cmdarr.map(Number)
    }
    else if(header[1] == 'water'){
        var water = { type: "", data:{ crt:  0 , max: 0 }};
        water.type = "waterprocess-" + cmdarr[0];
        water.data.crt = parseFloat(cmdarr[1]);
        water.data.max = parseFloat(cmdarr[2]);
        statusModel.waterStatus = water;
    }
    else if(header[1] == 'co2'){
        var co2 = {
            type: "co2-status", 
            data: {
                mode: 0,
                crt: 0,
                status: 0,
                sensor: 0
            }
        }
        co2.data.mode = parseFloat(cmdarr[0]);
        co2.data.crt = parseFloat(cmdarr[1]);
        co2.data.status = parseFloat(cmdarr[2]);
        co2.data.sensor = parseFloat(cmdarr[3]);
        statusModel.co2Status = co2;
    }
    else if(header[1] == 'ec'){
        var ec = {
            type: "ec-status", 
            data: {
                mode: 0,
                crt: 0,
                status: 0,
                sensor: 0
            }
        }
        ec.data.mode = parseFloat(cmdarr[0]);
        ec.data.crt = parseFloat(cmdarr[1]);
        ec.data.status = parseFloat(cmdarr[2]);
        ec.data.sensor = parseFloat(cmdarr[3]);
        statusModel.ecStatus = ec;
    }
    else if(header[1] == 'ph'){
        var ph = {
            type: "ph-status", 
            data: {
                mode: 0,
                crt: 0,
                status: 0,
                sensor: 0
            }
        }
        ph.data.mode = parseFloat(cmdarr[0]);
        ph.data.crt = parseFloat(cmdarr[1]);
        ph.data.status = parseFloat(cmdarr[2]);
        ph.data.sensor = parseFloat(cmdarr[3]);
        statusModel.phStatus = ph;
    }
    return {
        data: craftedJson,
        header: header[1]
    };
}

function ControlCraft(header, cmdarr) {
    
    var craftedJson = {}

    if(header[1] == 'chst'){
        var ch = parseInt(cmdarr[0]);
        var mode = parseInt(cmdarr[1]);
        var sensor = parseInt(cmdarr[2]);
        var status = parseInt(cmdarr[3]);
        controlModel.control[ch-1].mode = mode;
        controlModel.control[ch-1].sensor = sensor;
        controlModel.control[ch-1].ch = ch;
        controlModel.control[ch-1].manual.status = status;
        console.log('[Info] Recieved: channel-mode-sensor from channel ' + ch);
    }
    else if(header[1] == 'timer'){
        var ch = parseInt(cmdarr[0]);
        var mode = parseInt(cmdarr[1]);
        var timerstr = cmdarr[2];
        // [[300-480]-[540-720]-[780-960]-[1020-1200]-[1260-1439]]
        timerstr = ReplaceAll(timerstr,'-', ',');
        var timerlist = JSON.parse( "{\"list\": " + timerstr +" }")
        controlModel.control[ch-1].timer.list = timerlist.list;

        console.log('[Info] Recieved: timer from channel ' + ch);
    }
    else if(header[1] == 'setpoint'){
        var ch = parseInt(cmdarr[0]);
        var working = parseFloat(cmdarr[1]);
        var setpoint = parseFloat(cmdarr[2]);
        var detecting = parseFloat(cmdarr[3]);
        controlModel.control[ch-1].setpoint.working = working;
        controlModel.control[ch-1].setpoint.detecting = detecting;
        controlModel.control[ch-1].setpoint.setpoint = setpoint;
        
        console.log('[Info] Recieved: setpoint from channel ' + ch);
    }
    else if(header[1] == 'setbound'){
        var ch = parseInt(cmdarr[0]);
        var upper = parseFloat(cmdarr[1]);
        var lower = parseFloat(cmdarr[2]);
        controlModel.control[ch-1].setbound.upper = upper;
        controlModel.control[ch-1].setbound.lower = lower;
        console.log('[Info] Recieved: setbound from channel ' + ch);
    }
    //{ct-water,0,0,900,900}
    else if(header[1] == 'water'){
        var isCir = parseInt(cmdarr[0]);
        var isFill = parseFloat(cmdarr[1]);
        var cirTime = parseFloat(cmdarr[2]);
        var waitTime = parseFloat(cmdarr[3]);
        controlModel.waterControl.isCir = isCir;
        controlModel.waterControl.isFill = isFill;
        controlModel.waterControl.cirTime = cirTime;
        controlModel.waterControl.waitTime = waitTime;
        console.log('[Info] Recieved: water from channel ');
    }
    
    return {
        data: craftedJson,
        header: header[1]
    };
}

function SettingCraft(header, cmdarr) {
    var craftedJson = {};

    if(header[1] == 'cal'){
        var ec = parseInt(cmdarr[0]);
        var ph = parseFloat(cmdarr[1]);
        controlModel.calibration.ec = ec;
        controlModel.calibration.ph = ph;
        console.log('[Info] Recieved: calibration from channel ');
    }

    return {
        data: craftedJson,
        header: header[1]
    };
}

module.exports = {
    ExtractCommand,
    SplitCommand
}

// var cmd = "{st-sensors,0.00,0.00,0.00,0.00,-46.85,-6.00,-1.00,0}";
// var cmd2 = "{ct-chst,1,1,1,0}{ct-chst,2,0,4,0}{ct-chst,3,0,5,0}{ct-chst,4,2,6,0}"
// SplitCommand(cmd2);