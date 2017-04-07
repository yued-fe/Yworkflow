'use strict'

const PROJECT_CONFIG = require('../../yworkflow').getConfig(); //载入项目基础配置
const path = require('path');
const express = require('express');
const utils = require('../utils');
const qs = require('qs');
const parse = require('url-parse');
const router = express.Router();

router.get('/getPublicData', function(req, res, next) {
    res.header("Content-Type", 'application/json');
    res.send(JSON.stringify(utils.getPublicJSON({
        "CLIENT_URL": "",
    }, req, res), null, 4))
    next();
})



module.exports = router;
