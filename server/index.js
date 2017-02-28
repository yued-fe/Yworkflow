
require('./util/ejs-inline-template.js');//拓展ejs 支持script拓展

const path = require('path');

const bodyParser = require('body-parser');
const chalk = require('chalk');
const cookieParser = require('cookie-parser');
const express = require('express');
const logger = require('morgan');


const app = express();


app.set('view engine', 'ejs'); // 载入ejs模板
app.engine('html', require('ejs').renderFile);

// 拓展 extends 功能
// app.locals = require('./config/extends/loader');