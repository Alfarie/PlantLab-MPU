var express = require('express')
var router = express.Router();
var fs = require('fs');
var logger = require('../../datalogger/datalogger');
router.get('/finds/date', function (req, res) {
    var qstr = req.query;
    if (qstr.date == undefined) {
        res.json({
            "status": "query error"
        })
        return;
    }
    logger.GetLoggerByDate(qstr.date).then(
        rows => {
            res.json(rows);
        }
    )
});

router.get('/finds/date/csv', function (req, res) {
    var qstr = req.query;
    if (qstr.date == undefined) {
        res.json({
            "status": "query error"
        })
    }
    
    // console.log(json);
    logger.GetLoggerByDate(qstr.date).then(rows => {
        let keys = Object.keys(rows[0]);
        res.csv(
            rows, {
                fields: keys
            });
    });
});

router.get('/finds/short', function (req, res) {
    res.json(logger.GetShortLogger());
});

router.get('/finds/sparks', function (req, res) {
    res.json(logger.GetSparkLogger());
})

router.get('/finds/loggers/months', function (req, res) {
    if (req.query.my == undefined) {
        res.json({
            "status": "invalid request format"
        });
        return;
    }
});
module.exports = router;