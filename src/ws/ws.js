var express = require('express');
var jsoncsv = require('express-json-csv')(express);
var app = express();
var http = require('http').Server(app);
var path = require('path');
var io = require('socket.io')(http);

io = require('./socket').socketio(io);
var cors = require('cors');
app.use(cors());

var bodyParser = require('body-parser')
app.use(bodyParser.json());
app.use(express.urlencoded({
    extended: true
}));

var root = path.join(path.resolve(__dirname, '../../dist/'));
app.use(express.static(root));


var port = 3000;
/*
app.use((req, res, next) => {
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    if (token) {
        next();
        jwt.verify(token, app.get('superSecret'), function (err, decoded) {
            if (err) {
                return res.json({
                    success: false,
                    message: 'Failed to authenticate token.'
                });
            } else {
                // if everything is good, save to request for use in other routes
                req.decoded = decoded;
                next();
            }
        })
    } else {
        return res.status(403).json({
            success: false,
            message: 'No token provided.'
        });
    }
})
*/
var controlApi = require('./control/control-api');
app.use('/control/', controlApi);

var loggerApi = require('./logger/logger-api');
app.use('/logger/', loggerApi);

var settingApi = require('./setting/setting-api');
app.use('/setting/', settingApi);

var authApi = require('./auth/auth');
app.use('/auth/', authApi);

app.get('*', function (req, res) {
    res.redirect('/');
});
module.exports = {
    http,
    io,
    port
}