var io = null;
function emit(event,data){
    // console.log(event,data);
    io.to('0x01').emit(event,data);
}

function socketio(socketio){
    io = socketio;
    io.on('connection', function (socket) {
        console.log("[socket] Client Connected");
        socket.join('0x01');
        // socket.on('disconnect', function() {
        //     console.log('[socket] DISCONNECT');
        // });
    });
    return io;
}

module.exports = {
    socketio,
    emit
}