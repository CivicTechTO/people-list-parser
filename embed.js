---
---
function inIframe () {
  try {
    return window.self !== window.top;
  } catch (e) {
    return true;
  }
}

function getQueryVariable(variable) {
  var query = window.location.search.substring(1);
  var vars = query.split('&');
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split('=');
    if (decodeURIComponent(pair[0]) == variable) {
      return decodeURIComponent(pair[1]);
    }
  }
  console.log('Query variable %s not found', variable);
}

var getLocation = function(href) {
  var l = document.createElement("a");
  l.href = href;
  return l;
};

var generateCsvUrl = function(key, id) {
  return `https://docs.google.com/spreadsheets/d/${key}/export?format=csv&id=${key}&gid=${id}`
}

var getConfig = function (keyName, defaultValue) {
  var qsValue = getQueryVariable(keyName)
  if (qsValue) {
    return qsValue
  }

  return inIframe() ? (window.frameElement && window.frameElement.getAttribute('data-'+keyName) || defaultValue) : defaultValue
}

const app = new Vue({
  el: '#app',
  data: {
    rosterData: [],
    checkinData: [],
    items: [],
    statusFilter: '',
    style: 'grid',
    slackTeam: '{{ site.slack_team }}',
  },
  // NOTE: We do this because both Jekyll and VueJS try to use
  // double-curly-bracket syntax, eg. {{ some_var }}
  delimiters: ["<%","%>"],
  methods: {
    extractTwitterHandle: function(url) {
      return url.split('/')[3]
    },
    extractLinkedinHandle: function(url) {
      return url.split('/')[4]
    },
    slackUrl: function(memberId) {
      return `https://${this.slackTeam}.slack.com/team/${memberId}`
    },
    extractGDocResourceData: function(gDocUrl) {
      // Ex: https://docs.google.com/spreadsheets/d/1LCVxEXuv70R-NozOwhNxZFtTZUmn1FLMPVD5wgIor9o/edit#gid=642523045
      l = getLocation(gDocUrl)
      var key = l.pathname.split('/')[3]
      var sheet_id = l.hash.substr(1).split('=')[1]
      return [key, sheet_id]
    },
    avatarAltText: function(person) {
      return `Photo for ${person.first_name} ${person.last_name}`
    },
  },
  mounted () {
    var vm = this
    vm.statusFilter = getConfig('status', vm.statusFilter)
    vm.style = getConfig('style', vm.style)
    var generateFetchDataPromise = (keyName, defaultValue, dataKey) => {
      return new Promise((complete, error) => {
        const gDocUrl = getConfig(keyName, defaultValue)
        const [key, id] = vm.extractGDocResourceData(gDocUrl)
        const csvUrl = generateCsvUrl(key, id)
        Papa.parse(csvUrl, {
          download: true,
          header: true,
          complete: (results, file) => {
            vm.$set(this, dataKey, results.data)
            complete(results.data)
          },
        })
      })
    }
    var fetchRosterData = generateFetchDataPromise('gsheet-url', '{{ site.gsheet.url }}', 'rosterData')
    var fetchCheckinData = generateFetchDataPromise('gsheet-checkin-url', '{{ site.gsheet.checkin_url }}', 'checkinData')
    Promise.all([fetchRosterData, fetchCheckinData])
      .then((results) => {
        if (vm.checkinData) {
          vm.items = []
          // TODO: Compute active ranges for organizers?
          let checkinsByMember = _(vm.checkinData).sortBy('date').groupBy('slack_id').value()
          for (let [k,v] of Object.entries(checkinsByMember)) {
            var processSkippedKeys = (obj) => {
              for (let prop in obj) {
                if (['skip', 'pass', 'none'].includes(obj[prop].toLowerCase())) {
                  delete obj[prop]
                }
              }
              return obj
            }
            var stripLockPrefix = (obj) => {
              for (let prop in obj) {
                let PREFIX = 'lock:'
                if (obj[prop].toLowerCase().startsWith(PREFIX)) {
                  obj[prop] = obj[prop].substr(PREFIX.length)
                }
              }
              return obj
            }
            let member = _(vm.rosterData).find({'slack_id': k})
            member = processSkippedKeys(member)
            member = stripLockPrefix(member)
            if (v.length > 0) {
              let latest = v[v.length-1]
              if (vm.statusFilter == '' || vm.statusFilter == latest.status) {
                vm.items.push(member)
              }
            }
          }
        } else {
          var filtered = vm.rosterData.filter(function(item) {
            return vm.statusFilter == '' || vm.statusFilter == item.status
          })
          vm.items = filtered
        }
      })
  },
})

