---
---
const app = new Vue({
  el: '#app',
  data: {
    rows: [],
    statusFilter: '',
    style: 'grid',
    slackTeam: 'civictechto',
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
    }
  },
  mounted () {
    var vm = this
    new Promise((complete, error) => {
      function inIframe () {
        try {
          return window.self !== window.top;
        } catch (e) {
          return true;
        }
      }
      const key = inIframe ? (window.frameElement.getAttribute('data-gsheet-key') || '{{ site.gsheet.key }}') : '{{ site.gsheet.key }}'
      const id = inIframe ? (window.frameElement.getAttribute('data-gsheet-sheet-id') || '{{ site.gsheet.sheet_id }}') :'{{ site.gsheet.sheet_id }}'
      vm.statusFilter = inIframe ? (window.frameElement.getAttribute('data-status') || '') : ''
      vm.style = inIframe ? (window.frameElement.getAttribute('data-style') || 'grid') : ''
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

