new Vue ({
  el: 'body',

  ready: function() {
    // GET /logs
    this.$http.get('api/logs/', function(data, status, request) {
        // error
        if (data.error) {
          console.warn(data.message);
          this.$set('success', false);
          this.$set('message', data.message);
          this.$set('configSuccess', false);
        }
        // success
        else {
          console.log(data);
          // set data
          this.$set('success', true);
          this.$set('configSuccess', true);
          // Time
          var time = data[0].time / 1000;
          this.$set('lastUpdated', moment.unix(time).fromNow());
          // Errors
          this.$set('errors', data[0].summary.errors);
          // FailedPages
          this.$set('failedPages', data[0].failedPages);
          // Average Reponse Time
          this.$set('averageResponseTime', data[0].averageResponseTime);
          // isUp. Errors?
          if (data[0].summary.errors > 0) {
            this.$set('isUp', false);
            this.$set('message', 'Uh oh! Jasper has found ' + data[0].summary.errors + ' issue(s) with the following pages:');
            this.$set('statusColor', 'red');
          }
          else {
            this.$set('isUp', true);
            this.$set('message', 'Everything\'s Looking Good! Jasper is showing ' + data[0].summary.errors + ' issues. He will let you know if something comes up.');
            this.$set('statusColor', 'green');
          }
        }
    })
    .error(function(data, status, request) {
      console.log(status);
    });

    // GET /config
    this.$http.get('api/config/', function(data, status, request) {
        // error
        if (data.error) {
          console.warn(data.message);
        }
        // success
        else {
          console.log(data);
          this.$set('baseUrl', data.main.baseUrl);
        }
    })
    .error(function(data, status, request) {
      console.log(status);
    });
  },

  data: {
    success: false,
    configSuccess: null,
    message: null,
    statusColor: null,
    baseUrl: null,
    failedPages: null,
    isUp: null,
    errors: null,
    lastUpdated: null,
    averageResponseTime: null
  }
});
