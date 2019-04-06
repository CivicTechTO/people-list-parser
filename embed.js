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

const app = new Vue({
  el: '#app',
  data: {
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
    new Promise((complete, error) => {
      const gDocUrl = inIframe() ? (window.frameElement.getAttribute('data-gsheet-url') || '{{ site.gsheet.url }}') :'{{ site.gsheet.url }}'
      vm.statusFilter = inIframe() ? (window.frameElement.getAttribute('data-status') || '') : ''
      vm.style = inIframe() ? (window.frameElement.getAttribute('data-style') || 'grid') : 'grid'
      const [key, id] = vm.extractGDocResourceData(gDocUrl)
      const csvUrl = `https://docs.google.com/spreadsheets/d/${key}/export?format=csv&id=${key}&gid=${id}`
      Papa.parse(csvUrl, {
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

