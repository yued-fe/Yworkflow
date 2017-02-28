'use strict'

require('require-dir')('./tasks');

var path = require('path');
var gulp = require('gulp');
var nodemon = require('gulp-nodemon'); // server自动重启
var chalk = require('chalk');
var figlet = require('figlet');



gulp.task('nodemon', function() {

	figlet('Yworkflow', function(err, data) {
		if (err) {
			console.log('Something went wrong...');
			console.dir(err);
			return;
		}
		console.log(chalk.bold.green(data))
	});

    nodemon({
        script: 'server/index.js',
        nodeArgs: ['--harmony'],
        env: process.env.NODE_ENV
    }).on('restart');

});



gulp.task('default', ['nodemon']);