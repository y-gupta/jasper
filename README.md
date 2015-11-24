# Jasper
A simple bot that notifies you when specified webpages are down.

![JasperDemo](http://i.imgur.com/uYn5sSM.png)

## Usage
1. Install all of the project dependencies via
```npm install```.

2. Then, in ```config.app.js``` start configuring/customizing as much as you want to!

3. You can run script manually through CLI by running ```node app.js``` while in the directory (emails will still work) or
you can put the script on an AWS [lambda](https://console.aws.amazon.com/lambda/) instance to run automatically on a custom set interval. More information and a guide for this are in the works.

## Notification Options
* Email
* HipChat
* Slack (Coming Soon)
