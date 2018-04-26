var port = 3000;
var serialPort = '/dev/ttyACM0'
var production = false;

var loggerDirectory = __dirname.replace('/src/args', '/Logger/');
var loggerTime = 1000 * 60;

module.exports = {
    port,
    serialPort,
    production,
    loggerDirectory,
    loggerTime
}