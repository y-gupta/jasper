// Jasper
// A simple bot that emails you when specified pages are down
// Created by TJ Hillard - Nov 21 2015

/*jslint node: true */
'use strict';

// Dependencies - 'npm install'
var util = require('util');
var request = require('request');
var colors = require('colors');
var nodemailer = require('nodemailer');
var emoji = require('node-emoji');
var storage = require('node-persist');
  storage.initSync();
var moment = require('moment');

// Require app.config.js
var config = require('./app.config.js');

// ----- Global Variables -----
var errors = 0;
var warnings = 0;
var successes = 0;

// Async Counter
var counter = 0;

// Empty array that holds failed config.pages
var failedPages = [];

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
  }, function(error, response, body) {
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

    // If there are errors and email is turned on in config, Jasper will send an email!
    // ----- nodemailer ------
    var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: config.email.auth.emailAddress,
            pass: config.email.auth.password
        }
    });

    var mailOptions = {
        from: config.bot.name + ' ' + emoji.get(config.bot.emoji),
        to: config.email.recipients, // List of email recipients
        subject: errors + ' issue(s) detected with ' + config.main.baseUrl , // Subject line
        html: emoji.get(config.bot.emoji) + config.bot.name + '<span> has detected ' + errors + ' issue(s) with ' + '<a href="' + config.main.baseUrl +  '">' + config.main.baseUrl + '</a>.' +
        'The following config.pages are showing errors.</span><br><br>' + failedPages// HTML body
    };

    if (errors > 0 && config.main.emailNotifications) {
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          return console.log(error);
        }
        else {
          console.log(emoji.get(config.bot.emoji) + ' ' + config.bot.name + ' will be in touch soon!\nMessage Sent: ' + info.response);
        }
      });
    }


    // ----- HipChat ------
    if (config.main.hipchatNotifications) {
      var HipChatClient = require('hipchat-client');
      var hipchat = new HipChatClient(config.hipchat.token);

      if (errors > 0) {
        hipchat.api.rooms.message({
          room_id: 'Jasperio',
          from: 'Jasper',
          message: emoji.get(config.bot.emoji) + config.bot.name + '<span> has detected ' + errors + ' issue(s) with ' + '<a href="' + config.main.baseUrl +  '">' + config.main.baseUrl + '</a>.' +
          'The following config.pages are showing errors.</span><br><br>' + failedPages
        }, function (err, res) {
          if (err) { throw err; }
          else if (res.status === 'sent') {
            console.log('HipChat Message Sent!');
          }
        });
      }
    }

    clearInterval(isFinished);
  }
}, 250);
