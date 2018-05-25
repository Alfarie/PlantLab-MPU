const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
var dbdir = path.join(path.resolve(__dirname, '../../DB'));
var dbpath = dbdir + '/db.db';
var moment = require('moment');

if (!fs.existsSync(dbdir)) {
    fs.mkdirSync(dbdir);
}

function Connect(){
    return new Promise((resolve,reject) =>{
        resolve(
                new sqlite3.Database(dbpath, (err) => {
                if (err) {
                    return console.error(err.message);
                }
            })
        )
    });
}
function Close(db){
    db.close();
}
function Init(db){
    return new Promise( (resolve,reject)=>{
        let sql = `CREATE TABLE IF NOT EXISTS sensors_logger(
                        timestamp INTEGER PRIMARY KEY NOT NULL,
                        datetime TEXT NOT NULL,
                        temperature NUMBER NOT NULL,
                        humidity NUMBER NOT NULL,
                        co2 NUMBER NOT NULL,
                        ec NUMBER NOT NULL,
                        ph NUMBER NOT NULL,
                        water NUMBER NOT NULL,
                        light NUMBER NOT NULL)
                    `
        db.run(sql, (err)=>{
            if(err){
                reject(err.message);
            }
            resolve(db);
        })
    })
}

function ExecSql(sql, params){
    Connect()
    .then(db=>{
        db.run(sql,params,(err)=>{
            if(err){
                console.log(err.message);
            }
        })
        db.close();
    })
    .catch(err=>{
        console.log(err);
        db.close();
    })
}

function GetSql(sql, params){
    return new Promise( (resolve, reject)=>{
        Connect().then(db=>{
            db.all(sql,params,(err,rows)=>{
                if(err) reject(err.message);
                db.close();
                resolve(rows);
            })
        });
    })
}

// let sql = `INSERT INTO sensors_logger(timestamp,datetime,vpd,soil,temp,humi,co2,par,paracc)
//             VALUES(?,?,?,?,?,?,?,?,?);`
// let params = [moment().unix(), 
//     moment().format('YYYY-MM-DD hh:mm:ss'),
//     2200,
//     50,
//     25,
//     60,
//     1100,
//     300,
//     144
// ]

Connect()
    .then(Init)
    .then(Close)
    .catch(err=>{
        Close();
    });

module.exports = {
    ExecSql,
    GetSql
}