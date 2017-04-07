'use strict'
/**
 * 获得当前机器的IP地址
 */

const os = require('os');

var interfaces = os.networkInterfaces();
var addresses = [];



module.exports = function() {

    for (var k in interfaces) {
        for (var k2 in interfaces[k]) {
            var address = interfaces[k][k2];
            if (address.family === 'IPv4' && !address.internal) {
                addresses.push(address.address);
            }
        }
    }
    return addresses;

};
