# status-bot-node
A simple bot that emails you when specified webpages are down.

## Usage
1. Install all of the project dependencies via
```npm install```.

2. Then, in ```app.js``` start customizing as much as you want!

3. You can run script manually through CLI by running ```node app.js``` while in the directory (emails will still work) or
you can put the script on an AWS [lambda](https://console.aws.amazon.com/lambda/) instance to run automatically on a custom set interval. More information and a guide for this are in the works.

### Required Configuration
* baseUrl
* [pages]
* emailNotifications (default: false)
* {transporter} (service, auth)
* {mailOptions} (to)

### Optional Configuration
* Bot Name
* Bot Emoji - (Change the string in the emoji.get() function)
* Bot Email
