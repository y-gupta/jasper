// Jasper
// A simple bot that emails you when specified webpages are down
// Created by TJ Hillard - Nov 21 2015

/*jslint node: true */
'use strict';


// ----- Main Config -----

var main = {

  // What is the base url you want to target?
  baseUrl: 'http://orainteractive.com',

  // Do you want to send email notifications?
  // Yes -> true      No -> false
  emailNotifications: false,

  // Do you want to activate HipChat notifications?
  hipchatNotifications: true

};


// ----- Pages Config -----

var pages = [

  // What pages do you want to test from the baseUrl?
  '/',
  '/studio',
  '/process',
  '/portfolio',
  '/careers',
  '/blog',
  '/notarealpage404',
  '/alsonotarealpage'

];


// ----- Bot Config -----

var bot = {

  // Give your bot a little personality to match you/your team
  name: 'Jasper',
  emoji: 'tophat',

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
  recipients: ['recipient1@email.com', 'recipient2@email.com']

};


// ----- HipChat Config ------

var hipchat = {

  // When logged in, go to https://<yourteamname>.hipchat.com/admin/api
  // Register a new Admin Auth Token, and paste here!
  token: ''

};


exports.main = main;
exports.pages = pages;
exports.bot = bot;
exports.email = email;
exports.hipchat = hipchat;
