// Jasper
// A simple bot that notifies you when specified webpages are down
// Created by TJ Hillard - Nov 21 2015

/*jslint node: true */
'use strict';

// Dependencies - 'npm install'
var util = require('util');
var request = require('request');
var colors = require('colors');
var emoji = require('node-emoji');
var storage = require('node-persist');
var moment = require('moment');
var CronJob = require('cron').CronJob;

// Init Local Storage
storage.initSync();

// Require app.config.js and notifications.js
var config = require('../app.config.js');
var notifications = require('./notifications.js');

var runTests = function(callback) {

  // ----- Global Variables -----
  var status;
  var errors = 0;
  var warnings = 0;
  var successes = 0;

  // Async Counter
  var counter = 0;

  // Empty array that holds failed config.pages
  var failedPages = [];

  // Get start time to track the time it took for each request
  const startTime = new Date().getTime();


  // ---------- Run The Tests! ----------
  util.log(colors.blue.bold(' --------- ' + emoji.get('rocket') + ' Running Tests ' + emoji.get('rocket') + ' ---------\n'));

  console.log(colors.underline('Page, StatusCode, Speed(ms)'));

  // Begin looping through every page in config.pages array
  config.pages.forEach(function(val) {

    // Run async request to fetch the body data of that page
    request({
      url: config.main.baseUrl + val,
      json: false,
      timeout: 30000
    },
      // Callback
      function(error, response, body) {
        counter++;
        let requestTime = (new Date().getTime()) - startTime;
        let warningCodes = [201, 400, 401, 404, 500];

        if (response.statusCode == 200 || response.statusCode == 304) {
          console.log(colors.green(val + ': ' + response.statusCode + ' - ' + requestTime + 'ms'));
          successes++;
        }
        else if (warningCodes.indexOf(response.statusCode) === -1) {
          console.log(colors.yellow(val + ': ' + response.statusCode + ' - ' + requestTime + 'ms'));
          warnings++;
        }
        else {
          console.log(colors.red(val + ': ' + response.statusCode + ' - ' + requestTime + 'ms'));
          errors++;
          failedPages.push(val);
        }
      });
    });

  // Check if all async opertations are complete every quarter second
  var isFinished = setInterval(function() {

    if (counter === config.pages.length) {
      console.log(colors.underline('\nDone!' + '\n'));

      console.log(colors.underline('Summary'));
      console.log(colors.red.bold('Errors: ' + errors));
      console.log(colors.yellow('Warnings: ' + warnings));
      console.log(colors.green.underline('Success: ' + successes + '\n'));

      // Store Status Object to be used in Persisted Storage/API
      status = {
        time: moment(startTime).format('x'),
        summary: {
          errors: errors,
          warnings: warnings,
          successes: successes
        },
        failedPages: failedPages
      };

      exports.status = status;

      // Save data from this run to server localStorage
      storage.setItem((moment(startTime).format('MMMM Do YYYY, h:mm:ss a').toString()) + '.json', status);

      const LOGS = storage.values();
      const LOGS_REVERSE = storage.values().reverse();
      exports.LOGS = LOGS;
      exports.LOGS_REVERSE = LOGS_REVERSE;

      // All async methods complete
      clearInterval(isFinished);

      // Notifications
      notifications.areNotificationsSuppressed();

      // Runs Callback Function
      if (callback) {
        callback();
      }
    }
  }, 250);
};

// Initializes Data, Runs Preliminary Tests
// Callback function that launches express server and API
runTests(function() {
  var server = require('./server.js').runServer();
});

// Run Tests Every 15 minutes on the hour
new CronJob(config.main.testFrequency, function(){
  runTests();
}, null, true, "America/Chicago");
