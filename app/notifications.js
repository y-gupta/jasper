// Jasper
// A simple bot that notifies you when specified webpages are down
// Created by TJ Hillard - Nov 21 2015

/*jslint node: true */
'use strict';

var util = require('util');
var emoji = require('node-emoji');

var app = require('./app.js');
var config = require('../app.config.js');

// ----- Email ------
var sendEmail = function() {

  var nodemailer = require('nodemailer');
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
      subject: app.errors + ' issue(s) detected with ' + config.main.baseUrl , // Subject line
      html:
        emoji.get(config.bot.emoji) + config.bot.name + '<span> has detected ' + app.errors + ' issue(s) with ' +
        '<a href="' + config.main.baseUrl +  '">' + config.main.baseUrl + '</a>.' +
        'The following pages are showing errors.</span><br><br>' + app.failedPages // HTML body
  };

  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      return console.log(error);
    }
    else {
      util.log('Email Sent!');
    }
  });
};



// ----- HipChat ------
var sendHipChat = function() {

  var HipChatClient = require('hipchat-client');
  var hipchat = new HipChatClient(config.hipchat.token);

  hipchat.api.rooms.message({
    room_id: config.hipchat.room,
    from: config.bot.name,
    message:
      emoji.get(config.bot.emoji) + config.bot.name +
      '<span> has detected ' + app.errors + ' issue(s) with ' +
      '<a href="' + config.main.baseUrl +  '">' + config.main.baseUrl + '</a>.' +
      'The following pages are showing errors.</span><br><br>' + app.failedPages
  },
    // Callback
    function (err, res) {
    if (err) {
      console.log(err);
    }
    else if (res.status === 'sent') {
      util.log('HipChat Message Sent!');
    }
    else {
      console.log('There was a problem sending the HipChat message.');
    }
  });
};


// ----- Slack -----
var sendSlack = function() {

    var Slack = require('slack-node');

    var slack = new Slack();
    slack.setWebhook(config.slack.webhookUri);

    slack.webhook({
      channel: config.slack.channel,
      username: config.bot.name,
      icon_emoji: ":" + config.bot.emoji + ":",
      text:
        config.bot.name + ' has detected ' + app.errors + ' issue(s) with ' + config.main.baseUrl + '.\n' +
        'The following pages are showing errors.\n' + app.failedPages
    }, function(err, response) {
      if (err) {
        console.log(err);
      }
      else if (response.status == 'ok') {
        util.log('Slack message sent!');
      }
      else {
        console.log(response);
      }
    });

};


// ----- SMS (Twilio) -----
var sendSMS = function() {

    var client = require('twilio')(config.sms.accountSid, config.sms.authToken);

    var recipients = config.sms.to;
    recipients.forEach(function(recipient) {

      client.sendMessage({
          to: recipient,
          from: config.sms.twilioPhoneNumber,
          body:
            config.bot.name + ' has detected ' + app.errors + ' issue(s) with ' + config.main.baseUrl + '.\n' +
            'The following pages are showing errors.\n' + app.failedPages

      },
        function(err, responseData) {
          if (!err) {
              util.log('SMS Sent! (' + responseData.to + ')');
          }
          else {
            console.log(err);
          }
      });
    });

};


var sendAllNotifications = function() {
  if (config.main.emailNotifications) {
    sendEmail();
  }
  if (config.main.hipchatNotifications) {
    sendHipChat();
  }
  if (config.main.slackNotifications) {
    sendSlack();
  }
  if (config.main.smsNotifications) {
    sendSMS();
  }
};

// suppress Notifications if User Sets it
var suppressNotifications = {};

if (!config.main.notifyEveryError) {
  suppressNotifications.enabled = true;
}

// The logic for sending notifications when user has notification frequency set
var areNotificationsSuppressed = function() {
  // Were there any errors received?
  if (app.errors <= 0) {
    delete suppressNotifications.firstFail;
    delete suppressNotifications.lastFail;
  }
  else {
    if (suppressNotifications.enabled && app.errors > 0) {
      if (!suppressNotifications.firstFail) {
        suppressNotifications.firstFail = new Date().getTime();
      }
      else {
        suppressNotifications.lastFail = new Date().getTime();
      }
      if (suppressNotifications.firstFail && !suppressNotifications.lastFail) {
        sendAllNotifications();
      }
      else if (suppressNotifications.firstFail && suppressNotifications.lastFail) {
        let timeDiff = (suppressNotifications.lastFail - suppressNotifications.firstFail) / 1000;
        let timeLeft = (config.main.frequency * 3600) - timeDiff;

        if (timeDiff < (config.main.frequency * 3600)) {
          console.log('Notifications suppressed for another ' + timeLeft + ' seconds.');
        }
        else {
          suppressNotifications.firstFail = new Date().getTime();
          sendAllNotifications();
        }
      }
    }
    else {
      // supress notifications is disabled
      sendAllNotifications();
    }
  }
};

exports.sendEmail = sendEmail;
exports.sendHipChat = sendHipChat;
exports.sendSlack = sendSlack;
exports.sendSMS = sendSMS;
exports.sendAllNotifications = sendAllNotifications;
exports.areNotificationsSuppressed = areNotificationsSuppressed;
