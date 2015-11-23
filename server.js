// Node Site StatusBot
// Create a simple bot that emails you when webpages are down
// Created by TJ Hillard - Nov 21 2015

/*jslint node: true */
'use strict';

var express = require('express');
var app = express();

app.get('/', function(req, res) {
  res.send('Server running on port 8888.');
});

app.listen(8888);
