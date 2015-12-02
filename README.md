![travis](https://travis-ci.org/tjhillard/jasper.svg?branch=develop)

# Jasper
:tophat: A simple node app that notifies you when specified webpages are down

![JasperDemo](http://i.imgur.com/PUNaX5Y.png)

## Usage
1. Install all of the project dependencies via
```npm install```.

2. Then, in ```config.app.js``` start customizing as much or as little as you want!

3. To run the app, type ```npm run jasper```. By default, Jasper runs tests every 15 minutes. If you are experiencing issues getting up and running, try ```npm run doctor``` or open a GitHub issue.

## Notification Options
* Email
* HipChat
* Slack
* SMS (via Twilio)

## API (Still in Development)

### GET /api/logs
Returns array of objects containing all test logs. (JSON)

### GET /api/outages
Returns array of objects containing test logs for all cases of outages or incidents. (JSON)

