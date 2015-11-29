// Jasper
// A simple bot that notifies you when specified webpages are down
// Created by TJ Hillard - Nov 21 2015

/*jslint node: true */
'use strict';

var express = require('express');
var app = express();

var mainModule = require('./app.js');

var storage = require('node-persist');
  storage.initSync();

app.get('/api/logs', function (req, res) {
  res.send(mainModule.logs);
});

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Server and API are now online!');
});
