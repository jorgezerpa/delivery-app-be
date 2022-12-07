const socketIO = require('socket.io');
const socket = {}; //use an object to connection as reference

function connect(server){
    socket.io = socketIO(server, {
        cors: {
            origin:['*']
        }
    })
}

module.exports = {
    connect,
    socket
}
