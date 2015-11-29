// Jasper
// A simple bot that notifies you when specified webpages are down
// Created by TJ Hillard - Nov 21 2015

/*jslint node: true */
'use strict';

var express = require('express');
var app = express();
var storage = require('node-persist');
  storage.initSync();

var mainModule = require('./app.js');

// GET /api/logs/
app.get('/api/logs', function (req, res) {
  res.send(mainModule.logs);
});

// Launch Server
var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;
});
