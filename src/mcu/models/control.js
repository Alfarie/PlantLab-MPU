var fs = require('fs');
var strbf = fs.readFileSync(__dirname + '/control.json').toString();

const channel1 = JSON.parse(strbf);
const channel2 = JSON.parse(strbf);
const channel3 = JSON.parse(strbf);
const channel4 = JSON.parse(strbf);
const channel5 = JSON.parse(strbf);
const channel6 = JSON.parse(strbf);

var control = [
    channel1, channel2, channel3, channel4, channel5, channel6
]

var waterControl = {
    isCir: 0,
    isFill: 0,
    cirTime: 900,
    waitTime: 900
};

var calibration = {}


module.exports = {
    control,
    waterControl,
    calibration
}