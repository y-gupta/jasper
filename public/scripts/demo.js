new Vue ({
  el: 'body',

  ready: function() {
    // GET /logs
    this.$http.get('api/logs/', function(data, status, request) {
        // error
        if (data.error) {
          console.warn(data.message);
          this.$set('success', false);
          this.$set('current.message', data.message);
          this.$set('configSuccess', false);
        }
        // success
        else {
          // set data
          this.$set('logs.success', true);
          this.$set('configSuccess', true);
          // Time
          var time = data[0].time / 1000;
          this.$set('current.lastUpdated', moment.unix(time).fromNow());
          // Successes
          this.$set('current.summary.successes', data[0].summary.successes);
          // Warnings
          this.$set('current.summary.warnings', data[0].summary.warnings);
          // Errors
          this.$set('current.summary.errors', data[0].summary.errors);
          // FailedPages
          this.$set('current.failedPages', data[0].failedPages);
          // Average Reponse Time
          this.$set('current.averageResponseTime', data[0].averageResponseTime);
          // isUp. Errors?
          if (data[0].summary.errors > 0) {
            this.$set('current.isUp', false);
            this.$set('current.message', 'Uh oh! Jasper has found ' + data[0].summary.errors + ' issue(s) with the following pages:');
            this.$set('current.statusColor', 'red');
          }
          else {
            this.$set('current.isUp', true);
            this.$set('current.message', 'Everything\'s looking good! Jasper is showing ' + data[0].summary.errors + ' issues. Sit back and relax, we will let you know if something comes up.');
            this.$set('current.statusColor', 'green');
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
          this.$set('config.baseUrl', data.main.baseUrl);
        }
    })
    .error(function(data, status, request) {
      console.log(status);
    });

    // GET /outages
    this.$http.get('api/outages/', function(data, status, request) {
      if (data.length <= 0) {
        this.$set('outages.isEmpty', true);
        console.log('isEmpty true');
      }
      else {
        console.log('isEmpty > false');
        this.$set('outages.isEmpty', false);
        for (var i = 0; i < data.length; i++) {
          var time = moment.unix(data[i].time / 1000).format('MMMM Do YYYY, h:mm:ss a');
          var object = {
            data: data[i]
          };
          object.time = time;
          this.outages.list.push(object);
          console.log(this.outages.list);
        }
      }

    })
    .error(function(data, status, request) {
      console.warn('Uh oh. Something went wrong with the GET /outages request.');
    });
  },

  data: {
    logs: {
      succes: false
    },
    configSuccess: null,
    current: {
      message: '',
      statusColor: '',
      isUp: null,
      summary: {
        successes: null,
        warnings: null,
        errors: null
      },
      failedPages: null,
      lastUpdated: null,
      averageResponseTime: null
    },
    config: {
      baseUrl: ''
    },
    outages: {
      list: [],
      isEmpty: true,
      emptyMessage: 'No recent outages!'
    }
  }
});

// Hover Popup
$('.circle')
  .popup({
    position : 'top center',
    target   : '.circle',
    title    : 'Response Times',
    content  : 'This speed reflects the time in miliseconds that it took the server to fetch the body content of the specified site. If you are testing manually on your own you may notice discrepencies based off of client/server locations.'
  });
