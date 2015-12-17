# Jasper
:tophat: A simple node app that notifies you when specified webpages are down

## CLI
![JasperDemo](http://i.imgur.com/PUNaX5Y.png)

## Dashboard
![JasperUI](http://i.imgur.com/glbajeu.png)

## Getting Started
1. Install all of the project dependencies via
```npm install```.

2. Then, in ```config.app.js``` start customizing as much or as little as you want!

3. To run the app, type ```npm run jasper```. By default, Jasper runs tests every 30 minutes. If you are experiencing issues getting up and running, try ```npm run doctor``` or open a GitHub issue.

## Notification Options
* Email
* HipChat
* Slack
* SMS (via Twilio)

## API

### GET /api/logs
Returns array of objects containing all test logs.

### GET /api/outages
Returns array of objects containing test logs for all cases of outages or incidents.

### GET /api/config
Returns object with config variables for baseUrl and pages array.

### Usage

All custom configuration is handled in this file: ```config.app.js```, which located in the root directory of the project. All confiuration variables are rather straight forward but have individual instructions commented above them if needed (Don't forget to add this file to ```.gitignore``` before pushing any sensative information to your VCS). 

To take advantage of all of the features Jasper has to offer, a Parse app is required. To set up a free account and create a project, head [here](https://parse.com/signup). Once the app is created, you will need the Application and JavaScript keys from your App Settings which should be on the left side menu of your application dashboard.

Once those two keys are saved in the config, you should almost be good to go! Before deploying, it's safe to run ```npm run doctor``` to make sure nothing in the config is out of place. If the doctor says you're good to go, then go ahead and deploy to an AWS EC2 instance, Heroku, or whichever service you prefer.

### Contributing

The app is really simple and was just a fun little project for me while learning the basics of node/express. If you actually find this useful and would like to see it improved, pleasae feel free to open an issue and tell me what your plans/ideas are and I'd be happy to work with you!
