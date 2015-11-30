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
app.listen(process.env.PORT || 8888, function() {
  console.log('Express Server listening on port 8888!');
});

app.get('/', function(req, res) {
  res.send('Hello! Welcome to Jasper!');
});

// GET /api/logs/
app.get('/api/logs', function(req, res) {
  if (req.query.reverse === 'true') {
    res.send((tests.logs).reverse());
  }
  else {
    res.send(tests.logs);
  }
});
