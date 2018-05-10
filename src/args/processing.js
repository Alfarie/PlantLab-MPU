var config = require('./config');
var fs = require('fs');
var man = fs.readFileSync(__dirname + '/man.txt').toString();


var argProcess = function(arg){
    if(arg.startsWith("--SerialPort") || arg.startsWith('-sp')){
        let port = arg.split("=")[1];
        if(port == 'scan'){
            let found = ScanPort();
            config.serialPort = found;
        }
        else{
            console.log('[Info] Setup Port:' + port);
            config.serialPort = port;
        }   
       
    }

    else if(arg.startsWith("--Production") || arg.startsWith('-prod')){
        console.log('[Info] Production');
        config.production = true;
    }

    else if(arg.startsWith("--loggerTime") || arg.startsWith('-logger')){
        let time = arg.split("=")[1];
        config.loggerTime = time;
    }

    else if(arg.startsWith("--iface")){
        let iface = arg.split("=")[1];
        config.interface = iface;
    }
    
    else if(arg.startsWith("--man")){
        console.log(man);
        return false;
    }


    return true;
}

function ScanPort(){
    let prefixPort = '/dev/ttyACM';
    for(var i = 0 ; i < 20; i++){
        let port = prefixPort + i;
        if (fs.existsSync(port)) {
            console.log('[Info] Found Port');
            return port;
        }
    }
    return prefixPort;
}


module.exports = {
    argProcess: argProcess
}


