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
          // set data
          this.$set('success', true);
          this.$set('configSuccess', true);
          // Time
          var time = data[0].time / 1000;
          this.$set('lastUpdated', moment.unix(time).fromNow());
          // Successes
          this.$set('successes', data[0].summary.successes);
          // Warnings
          this.$set('warnings', data[0].summary.warnings);
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
            this.$set('message', 'Everything\'s looking good! Jasper is showing ' + data[0].summary.errors + ' issues. Sit back and relax, we will let you know if something comes up.');
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
          this.$set('baseUrl', data.main.baseUrl);
        }
    })
    .error(function(data, status, request) {
      console.log(status);
    });

    // GET /outages
    this.$http.get('api/outages/', function(data, status, request) {
      for (var i = 0; i < 3; i++) {
        var time = moment.unix(data[i].time / 1000).format('MMMM Do YYYY, h:mm:ss a');
        var object = {
          data: data[i]
        };
        object.time = time ;
        this.outages.push(object);
      }
    })
    .error(function(data, status, request) {

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
    successes: null,
    warnings: null,
    errors: null,
    lastUpdated: null,
    averageResponseTime: null,
    outages: []
  }
});

// Hover Popup
$('.circle')
  .popup({
    position : 'top center',
    target   : '.circle',
    title    : 'Response Times',
    content  : 'This speed reflects the time in miliseconds that it took the server to fetch the body content of the specified site. If you are testing manually on your own you may notice discrepencies based off of client/server locations.'
  })
;
