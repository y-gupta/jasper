// Jasper
// A simple bot that notifies you when specified webpages are down
// Created by TJ Hillard - Nov 21 2015

/*jslint node: true */
'use strict';


// ----- Main Config -----

var main = {

  // What is the base url you want to target?
  baseUrl: 'http://orainteractive.com',

  // Run Tests Every So Often
  // Default: Every 30 Minutes
  // Read up about Cron Syntax Here --> http://crontab.org/
  testFrequency: '0 00,30 * * * *',

  // Include Parse Database Integration?
  // Sign up for Parse for free, and enter your app ID below in the parse section
  parseEnabled: false,

  // Do you want to send email notifications?
  // Yes -> true      No -> false
  emailNotifications: false,

  // Do you want to activate HipChat notifications?
  // Yes -> true      No -> false
  hipchatNotifications: false,

  // Do you want to activate Slack notifications?
  // Yes -> true      No -> false
  slackNotifications: false,

  // Do you want to activate SMS notifications?
  // Yes -> true      No -> false
  smsNotifications: false,

  // Do you want to receieve notifications every time there is an error?
  // Yes -> true      No -> false
  notifyEveryError: false,

  // If you chose false, set the hours between repeat/followup notifications
  frequency:  2 // in hours

};


// ----- Pages Config -----

var pages = [

  // What pages do you want to test from the baseUrl?
  // Note: Jasper won't test the base url by itself, set '/' as a page to do that!
  '/',
  '/studio',
  '/process',
  '/portfolio',
  '/careers',
  '/blog'
];


// ----- Bot Config -----

var bot = {

  // Give your bot a little personality to match you/your team
  name: 'Jasper',
  emoji: 'tophat',

};


var parse = {

  // Jasper uses the Parse SDK as the database in the cloud
  // In order to take advnatage of the Incident Logs + API features, the following info is required

  // Application ID
  // In your Parse Dashboard, Settings > Keys
  appId: '',

  // JavaScript Key
  // Settings > Keys
  jsId: ''
};


// ----- Email Config -----

var email = {

  auth: {

    // Gmail needs an account to authorize the messages being sent
    // Note: This will also be the return address for the automated emails
    emailAddress: '',
    password: ''

  },

  // Who will be receiving these email notifications?
  // Note: Must be array
  recipients: ['']

};


// ----- HipChat Config ------

var hipchat = {

  // When logged in, go to https://<yourteamname>.hipchat.com/admin/api
  // Register a new Admin Auth Token, and paste here!
  token: '',

  // Room ID that you want to send the message to
  room: ''

};


// ----- Slack Config -----
var slack = {

  // To use the Slack Notifications, you will need to set up an incoming webhook
  // https://<yourSlackTeam>.slack.com/services/new/incoming-webhook
  // Once generated, copy the webhookUri and paste here
  webhookUri: '',

  // What channel do you want the bot to post to?
  // Example '#general'
  channel: '',

  // The SlackBot Emoji will automatically use the emoji set in your bot config :)

};

var sms = {

  // For SMS you need a Twilio Account
  // Register at www.twilio.com

  // Account SID, found in your API Dashboard
  // www.twilio.com/user/account/messaging/dashboard
  accountSid: '',

  // Auth token, also found in Dashboard
  // www.twilio.com/user/account/messaging/dashboard
  authToken: '',

  // Your Twilio Phone Number
  // www.twilio.com/user/account/messaging/phone-numbers
  // This will be the number that sends the SMS messages
  // Example Format: +15132569007
  twilioPhoneNumber: '',

  // SMS Recipient(s)
  // Who will be receiving the texts?
  // Example Format: +15132569007
  // Note: This must be an array.
  to: ['']

};


exports.main = main;
exports.pages = pages;
exports.bot = bot;
exports.parse = parse;
exports.email = email;
exports.hipchat = hipchat;
exports.slack = slack;
exports.sms = sms;
