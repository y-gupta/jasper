// Jasper
// A simple bot that notifies you when specified webpages are down
// Created by TJ Hillard - Nov 21 2015

/*jslint node: true */
'use strict';

var express = require('express');
var app = express();
var storage = require('node-persist');
    storage.initSync();

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


app.get('/api/logs', function(req, res) {
  // GET /api/logs/
  if (req.query.reverse === 'true') {
    res.send(tests.LOGS);
  }
  else {
    res.send(tests.LOGS_REVERSE);
  }
});
