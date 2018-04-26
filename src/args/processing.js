var config = require('./config');
var fs = require('fs');
var man = fs.readFileSync(__dirname + '/man.txt').toString();


var argProcess = function(arg){
    if(arg.startsWith("--SerialPort") || arg.startsWith('-sp')){
        let port = arg.split("=")[1];
        config.serialPort = port;
    }

    else if(arg.startsWith("--Production") || arg.startsWith('-prod')){
        console.log('[Info] Production');
        config.production = true;
    }

    else if(arg.startsWith("--loggerTime") || arg.startsWith('-logger')){
        let time = arg.split("=")[1];
        config.loggerTime = time;
    }
    
    else if(arg.startsWith("--man")){
        console.log(man);
        return false;
    }

    return true;
}


module.exports = {
    argProcess: argProcess
}


