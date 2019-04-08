---
---
function inIframe () {
  try {
    return window.self !== window.top;
  } catch (e) {
    return true;
  }
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
  return inIframe() ? (window.frameElement.getAttribute('data-'+keyName) || defaultValue) : defaultValue
}

const app = new Vue({
  el: '#app',
  data: {
    rosterData: [],
    checkinData: [],
    rows: [],
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
    var fetchRosterData = new Promise((complete, error) => {
      const gDocUrl = getConfig('gsheet-url', '{{ site.gsheet.url }}')
      const [key, id] = vm.extractGDocResourceData(gDocUrl)
      const rosterCsvUrl = generateCsvUrl(key, id)
      Papa.parse(rosterCsvUrl, {
        download: true,
        header: true,
        complete: (results, file) => {
          vm.rosterData = results.data
        },
      })
    })
    var fetchCheckinData = new Promise((complete, error) => {
      const gDocUrl = getConfig('gsheet-checkin-url', '{{ site.gsheet.checkin_url }}')
      const [key, id] = vm.extractGDocResourceData(gDocUrl)
      const checkinCsvUrl = generateCsvUrl(key, id)
      Papa.parse(checkinCsvUrl, {
        download: true,
        header: true,
        complete: (results, file) => {
          vm.checkinData = results.data
        },
      })
    })
    Promise.all([fetchRosterData, fetchCheckinData])
      .then((results) => {
        console.log(vm.checkinData)
        console.log(vm.rosterData)
      })
    new Promise((complete, error) => {
      const gDocUrl = getConfig('gsheet-url', '{{ site.gsheet.url }}')
      vm.statusFilter = getConfig('status', vm.statusFilter)
      vm.style = getConfig('style', vm.style)
      const [key, id] = vm.extractGDocResourceData(gDocUrl)
      const rosterCsvUrl = generateCsvUrl(key, id)
      Papa.parse(rosterCsvUrl, {
        download: true,
        header: true,
        complete: complete,
      })
    })
      .then(function(results, file) {
        var filtered = results.data.filter(function(item) {
          return vm.statusFilter == '' || vm.statusFilter == item.status
        })
        vm.rows = filtered
      })
  },
})

