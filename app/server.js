// Jasper
// A simple bot that notifies you when specified webpages are down
// Created by TJ Hillard - Nov 21 2015

/*jslint node: true */
'use strict';

var util    = require('util');
var Parse   = require('parse/node');
var request = require('request');
var express = require('express');
var app     = express();
var config  = require('../app.config.js');

// Parse Init
var DetailedLogs = Parse.Object.extend("DetailedLogs");
var detailedLogs = new DetailedLogs();

Parse.initialize(config.parse.appId, config.parse.jsId);

var tests = require('./app.js');

// Launch Server
var runServer = function() {
  const PORT = process.env.PORT || 8888;
  app.listen(PORT, function() {
    console.log('Data initialized and Express Server sucessfully running on port ' + PORT + '!');
  });
};

exports.runServer = runServer;

// API Root Splash View
app.get('/', function(req, res) {
  res.send('Hello! Welcome to Jasper!');
});


// ---------------- API ----------------

// GET /api/logs
// Returns array of objects for ALL logs
app.get('/api/logs', function(req, res) {

  // If user has Parse disabled in config
  if (!config.main.parseEnabled || config.parse.appId === null || config.parse.jsId === null) {
    res.json({
      error: true,
      message: 'There is a problem with your Parse configuration. Please make sure that you have parseEnabled set to true, and your APP ID + JavaScript ID are saved in app.config.js.',
    });
  }
  // Parse config data valid, they should be good to go
  else {
    let logsArray = [];
    var query = new Parse.Query(detailedLogs);

    query.find({
      success: function(data) {
        util.log("GET /logs Returned " + data.length + " logs.");
        for (var i = 0; i < data.length; i++) {
          var object = data[i];
          logsArray.push(object);
        }
        res.json(logsArray.reverse());
      },
      error: function(error) {
        util.log("Parse Query Error: " + error.code + " " + error.message);
        res.json({
          error: true,
          message: "Parse Query Error: " + error.code + " " + error.message
        });
      }
    });
  }
});

// GET /api/outages
// Returns array of objects with logs for all recent outages/incidents
app.get('/api/outages', function(req, res) {

  // If user has Parse disabled in config
  if (!config.main.parseEnabled || config.parse.appId === null || config.parse.jsId === null) {
    res.json({
      error: true,
      message: 'There is a problem with your Parse configuration. Please make sure that you have parseEnabled set to true, and your APP ID + JavaScript ID are saved in app.config.js.'
    });
  }
  else {
    let logsArray = [];
    var query = new Parse.Query(detailedLogs);

    query.greaterThan('summary.errors', 0);
    query.find({  
      success: function(data) {
        util.log("GET /outages: Returned " + data.length + " logs.");
        for (var i = 0; i < data.length; i++) {
          var object = data[i];
          logsArray.push(object);
        }
        res.json(logsArray.reverse());
      },
      error: function(error) {
        util.log("Parse Query Error: " + error.code + " " + error.message);
        res.json({
          error: true,
          message: "Parse Query Error: " + error.code + " " + error.message
        });
      }
    });
  }
});
