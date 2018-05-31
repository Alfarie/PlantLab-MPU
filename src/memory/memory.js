var os = require('os');
function GetOSMemory(){
    return {
        freemem: os.freemem(),
        totalmem: os.totalmem()
    }
}

function GetNodeMemory(){
    return process.memoryUsage();
}

module.exports = {
    GetOSMemory,
    GetNodeMemory
}