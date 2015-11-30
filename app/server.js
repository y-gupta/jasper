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

app.get('/', function(request, response) {
  response.send('Hello! Welcome to Jasper!');
});

// GET /api/logs/
app.get('/api/logs', function(request, response) {
  if (request.query.reverse === 'true') {
    response.send((tests.logs).reverse());
  }
  else {
    response.send(tests.logs);
  }
});
