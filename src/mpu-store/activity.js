var fs = require('fs');
var plant = JSON.parse(fs.readFileSync(__dirname + '/plants.json').toString())
var activity = JSON.parse(fs.readFileSync(__dirname + '/activity.json').toString())

function SaveActivity(act){
    activity = act;
    console.log(activity);
    fs.writeFileSync(__dirname + '/activity.json', JSON.stringify(activity));
}

function GetActivity(){
    let data = JSON.parse(fs.readFileSync(__dirname + '/activity.json').toString())
    return data;
}

module.exports = {
    plant,
    SaveActivity,
    GetActivity
}