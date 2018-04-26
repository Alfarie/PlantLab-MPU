const assert = require('chai').assert;
const should = require('chai').should;
const expect = require('chai').expect;
const sinon = require('sinon');
var serial = require('./serial');
var async = require('async');
const SerialPort = require('serialport');

describe('Serial Port Module', () => {
    describe('#SerialPortConnect()', function(){
        it('should return true if connection successful', (done)=>{
            const expectedValue = serial.SerialPortConnect('/dev/ttyACM0')
            expectedValue.then( (res)=>{
                expect(res).to.equal(true);
            }).then(done, done)
        });
    })
});