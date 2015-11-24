// Jasper
// A simple bot that emails you when specified webpages are down
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

// ----- Bot Config -----
// Give your bot some personality to fit your team
var botName = 'Jasper';
var botEmoji = emoji.get('tophat');
var botEmail = 'testbot@gmail.com';

// ----- Global Config -----
// What is the base url you want to target?
var baseUrl = 'http://orainteractive.com';

// What webpages do you want to ping?
var pages = [
  '/',
  '/studio',
  '/process',
  '/portfolio',
  '/careers',
  '/blog',
  '/notarealpage404',
  '/alsonotarealpage'
];

// Do you want to send email notifications?
var emailNotifications = false;  // If true, don't forget to set your email config below!

// ----- Global Variables -----
var errors = 0;
var warnings = 0;
var successes = 0;

// Async Counter
var counter = 0;

// Empty array that holds failed pages
var failedPages = [];

// Get start time to track the time it took for each request
const startTime = new Date().getTime();

// ----- Logic to Run Tests -----
util.log(colors.blue.bold(' --------- ' + emoji.get('rocket') + ' Running Tests ' + emoji.get('rocket') + ' ---------\n'));

console.log(colors.underline('Page, StatusCode, Speed(ms)'));

// Begin looping through every page in pages array
pages.forEach(function(val) {

  // Run async request to fetch the body data of that page
  request({
    url: baseUrl + val,
    json: false
  }, function(error, response, body) {
    counter++;
    let requestTime = (new Date().getTime()) - startTime;

    if (response.statusCode == 200) {
      console.log(colors.green(val + ': ' + response.statusCode + ' - ' + requestTime + 'ms'));
      successes++;
    }
    else if (
        response.statusCode != 201 ||
        response.statusCode != 400 ||
        response.statusCode != 401 ||
        response.statusCode != 404 ||
        response.statusCode != 500) {
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

  // ----- Email Config -----
  var transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
          // Gmail needs an account to authorize the messages being sent
          user: '',
          pass: ''
      }
  });

  var mailOptions = {
      from: botName + ' ' + botEmoji + ' ' + botEmail,
      to: '', // List of email recipients
      subject: errors + ' issue(s) detected with ' + baseUrl , // Subject line
      html: botEmoji + botName + '<span> has detected ' + errors + ' issue(s) with ' + '<a href="' + baseUrl +  '">' + baseUrl + '</a>.' +
      'The following pages are showing errors.</span><br><br>' + failedPages// html body
  };

  if (counter === pages.length) {
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
    if (errors > 0 && emailNotifications) {
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          return console.log(error);
        }
        console.log(botEmoji + ' ' + botName + ' will be in touch soon!\nMessage Sent: ' + info.response);
      });
    }
    else if (errors > 0 && !emailNotifications) {
      // There are errors, but 'emailNotifications' is turned off via config. Do nothing.
    }
    else {
      // If no errors, do nothing
      console.log('Everything is looking good!');
    }

    clearInterval(isFinished);
  }
}, 250);
