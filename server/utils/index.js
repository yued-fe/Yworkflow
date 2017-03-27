'use strict'

const fs = require('fs');
const path = require('path');

const utils = {};

fs.readdirSync(__dirname).filter(function (file) {
    return path.extname(file) === '.js' && file !== 'index.js';
}).forEach(function (file) {
    const methodName = path.basename(file, '.js');
    const methodHandler = require(path.join(__dirname, file));

    utils[methodName] = methodHandler;
});

module.exports = utils;
