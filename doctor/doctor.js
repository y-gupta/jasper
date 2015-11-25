// Jasper
// A simple bot that notifies you when specified webpages are down
// Created by TJ Hillard - Nov 21 2015

/*jslint node: true */
'use strict';

// Dependencies
var colors = require('colors');
var emoji = require('node-emoji');

// Require app.config.js
const config = require('../app.config.js');

var doctorTests = (function() {
  var issues = 0;

  var checkForBlankWhenEnabled = function(array, section) {
    array.forEach(function(config) {
      if (config === null || config === '') {
        issues++;
        console.log(colors.red('Missing requried field in ' + section + ' Config!'));
      }
    });
  };

  // Basic Checks
  // Is baseUrl blank?
  if (config.main.baseUrl === null || config.main.baseUrl === '') {
    issues++;
    console.log(colors.red('config.main.baseUrl is blank.'));
  }
  // Does pages array have values?
  if (config.pages.length === 0) {
    issues++;
    console.log(colors.red('config.pages array has 0 entries!'));
  }
  // Does pages array have all stings?
  (config.pages).forEach(function(page) {
    if (typeof page !== 'string') {
      issues++;
      console.log(colors.red(JSON.stringify(page) + ' is not a string!\n ---> All pages must be strings!'));
    }
  });
  // Does email.recipients array contain all strings?
  (config.email.recipients).forEach(function(recipient) {
    if (typeof recipient !== 'string') {
      issues++;
      console.log(colors.red(JSON.stringify(recipient) + ' is not a string!\n ---> All Email recipients must be strings!'));
    }
  });
  // Does sms.to array contain all strings?
  (config.sms.to).forEach(function(recipient) {
    if (typeof recipient !== 'string') {
      issues++;
      console.log(colors.red(JSON.stringify(recipient) + ' is not a string!\n ---> All SMS recipients must be strings!'));
    }
  });
  // Check to see if all fields are the right data type
  let shouldBeStrings = [
    config.main.baseUrl,
    config.bot.name,
    config.bot.emoji,
    config.email.auth.emailAddress,
    config.email.auth.password,
    config.hipchat.token,
    config.hipchat.room,
    config.slack.webhookUri,
    config.slack.channel,
    config.sms.accountSid,
    config.sms.authToken,
    config.sms.twilioPhoneNumber
  ];
  shouldBeStrings.forEach(function(config) {
    if (typeof config !== 'string') {
      issues++;
      console.log(colors.red(JSON.stringify(config) + ' must be a string!'));
    }
  });
  // Are all activation booleans booleans?
  let shouldBeBoolean = [
    config.main.emailNotifications,
    config.main.hipchatNotifications,
    config.main.slackNotifications,
    config.main.smsNotifications
  ];
  shouldBeBoolean.forEach(function(config) {
    if (typeof config !== 'boolean') {
      issues++;
      console.log(colors.red(JSON.stringify(config) + ' must be a boolean! \n--> All notification configs should be booleans.'));
    }
   });

   // Check if a notification method is actiavted but config fields are blank
   if (config.main.emailNotifications) {
     let shouldNotBeBlank = [
       config.email.auth.emailAddress,
       config.email.auth.password,
       config.email.recipients
     ];
     checkForBlankWhenEnabled(shouldNotBeBlank, 'Email');
   }
   if (config.main.hipchatNotifications) {
     let shouldNotBeBlank = [
       config.hipchat.token,
       config.hipchat.room
     ];
     checkForBlankWhenEnabled(shouldNotBeBlank, 'HipChat');
   }
   if (config.main.slackNotifications) {
     let shouldNotBeBlank = [
       config.slack.webhookUri,
       config.slack.channel
     ];
     checkForBlankWhenEnabled(shouldNotBeBlank, 'Slack');
   }
   if (config.main.smsNotifications) {
     let shouldNotBeBlank = [
       config.sms.accountSid,
       config.sms.authToken,
       config.sms.twilioPhoneNumber,
       config.sms.to
     ];
     checkForBlankWhenEnabled(shouldNotBeBlank, 'SMS');
   }


  // Done
  if (issues === 0) {
    console.log('\n----------------------------------------');
    console.log(colors.green('Everything looks good! ') + emoji.get('hospital'));
    console.log('If you are experiencing an issue still, try cloning the project down again and starting over!');
    console.log('Also, feel free to raise an issue on GitHub.');
    console.log('----------------------------------------\n');
  }
  else {
    console.log(colors.red.underline.bold('\nUh oh. The doctor found ' + issues.toString() + ' issues.'));
  }
}());
