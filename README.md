![travis](https://travis-ci.org/tjhillard/jasper.svg?branch=develop)

# Jasper
:tophat: A simple bot that notifies you when specified webpages are down.

![JasperDemo](http://i.imgur.com/uYn5sSM.png)

## Usage
1. Install all of the project dependencies via
```npm install```.

2. Then, in ```config.app.js``` start configuring/customizing as much or as little as you would like!

3. To run the app, type ```npm run jasper```. If you are experiencing issues, try ```npm run doctor```.

4. You can run script manually through CLI by running ```node app.js``` while in the directory or
you can put the script automatically on an interval via AWS [lambda](https://console.aws.amazon.com/lambda/). More information and a guide for this are in the works.

## Notification Options
* Email
* HipChat
* Slack
* SMS (via Twilio)
