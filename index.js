---
---
const app = new Vue({
  el: '#app',
  data: {
    rows: [],
  },
  delimiters: ["<%","%>"],
  methods: {
    extractTwitterHandle: function(url) {
      return url.split('/')[3]
    },
    extractLinkedinHandle: function(url) {
      return url.split('/')[4]
    },
  },
  mounted () {
    var vm = this
    new Promise((complete, error) => {
      const key = '{{ site.gsheet.key }}'
      const id = '{{ site.gsheet.sheet_id }}'
      const csvUrl = `https://docs.google.com/spreadsheets/d/${key}/export?format=csv&id=${key}&gid=${id}`
      Papa.parse(csvUrl, {
        download: true,
        header: true,
        complete: complete,
      })
    })
      .then(function(results, file) {
        vm.rows = results.data
      })
  },
})

