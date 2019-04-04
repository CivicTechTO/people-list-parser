window.onload = function() {
  iframe_document = document.getElementById("people-list").contentWindow.document
  Array.prototype.forEach.call(window.parent.document.querySelectorAll("link[rel=stylesheet]"), function(link) {
    var newLink = document.createElement("link")
    newLink.rel  = link.rel
    newLink.href = link.href
    iframe_document.head.appendChild(newLink)
  })
}
