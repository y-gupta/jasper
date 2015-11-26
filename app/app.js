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
  storage.initSync();
var moment = require('moment');
var CronJob = require('cron').CronJob;

// Require app.config.js and notifications.js
var config = require('../app.config.js');
var notifications = require('./notifications.js');

// suppress Notifications if User Sets it
var suppressNotifications = {};

if (!config.main.notifyEveryError) {
  suppressNotifications.enabled = true;
}

var runJasper = function() {

  // ----- Global Variables -----
  var errors = 0;
  var warnings = 0;
  var successes = 0;

  // Async Counter
  var counter = 0;

  // Empty array that holds failed config.pages
  var failedPages = [];
  exports.failedPages = failedPages;

  // Get start time to track the time it took for each request
  const startTime = new Date().getTime();


  // ----- Run The Tests! -----
  util.log(colors.blue.bold(' --------- ' + emoji.get('rocket') + ' Running Tests ' + emoji.get('rocket') + ' ---------\n'));

  console.log(colors.underline('Page, StatusCode, Speed(ms)'));

  // Begin looping through every page in config.pages array
  config.pages.forEach(function(val) {

    // Run async request to fetch the body data of that page
    request({
      url: config.main.baseUrl + val,
      json: false
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

    exports.errors = errors;

    if (counter === config.pages.length) {
      console.log(colors.underline('\nDone!' + '\n'));

      console.log(colors.underline('Summary'));
      console.log(colors.red.bold('Errors: ' + errors));
      console.log(colors.yellow('Warnings: ' + warnings));
      console.log(colors.green.underline('Success: ' + successes + '\n'));

      // Save data from this run to server localStorage
      // Located in 'Persist' folder, only visible after frist completed run
      storage.setItem(moment(startTime).format('x').toString(),
        {
          time: moment(startTime).format('x'),
          results: {
            successes: successes,
            warnings: warnings,
            errors: errors,
            failedPages: failedPages
          },
        }
      );

      // Were there any errors received?
      if (errors === 0) {
        delete suppressNotifications.firstFail;
        delete suppressNotifications.lastFail;
      }
      else {
        // module.exports = failedPages;
        // Hold notifications if user just got one recently.
        // Check if user has setting enabled
        if (suppressNotifications.enabled) {
          // They do
          // Does the object have a first fail property saved?
          if (!suppressNotifications.firstFail) {
            // No first fail, this must be it
            suppressNotifications.firstFail = new Date().getTime();
          }
          else {
            suppressNotifications.lastFail = new Date().getTime();
          }
          // We now either have a first fail and/or last fail.
          // If first fail is active but last fail isn't -> user needs to receive notifications.
          if (suppressNotifications.firstFail && !suppressNotifications.lastFail) {
            // send notifications
            notifications.sendAllNotifications();
          }
          // If first fail and last fail are both truthy, then check time between the two
          else if (suppressNotifications.firstFail && suppressNotifications.lastFail) {
            let timeDiff = (suppressNotifications.lastFail - suppressNotifications.firstFail) / 1000;
            let timeLeft = (config.main.frequency * 3600) - timeDiff;

            if (timeDiff < (config.main.frequency * 3600)) {
              console.log('Notifications suppressed for another ' + timeLeft + ' seconds.');
            }
            else {
              suppressNotifications.firstFail = new Date().getTime();
              notifications.sendAllNotifications();
            }
          }
        }
      }


      // All async methods complete
      clearInterval(isFinished);

    }
  }, 250);
};

// Server???
// var http = require('http');

// Run Jasper Every 15 minutes on the hour
new CronJob('0,15,30,45 * * * * *', function(){
  runJasper();
}, null, true, "America/Chicago");
