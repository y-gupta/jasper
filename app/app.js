// Jasper
// A simple bot that notifies you when specified webpages are down
// Created by TJ Hillard - Nov 21 2015

/*jslint node: true */
'use strict';

var CronJob = require('cron').CronJob;

var config = require('../app.config.js');
var notifications = require('./notifications.js');
var tests = require('./tests.js');

new CronJob('00 00,15,30,45 * * * *', function(){
  tests.runTests();
}, null, true, "America/Chicago");
