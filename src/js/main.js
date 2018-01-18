var el = document.createElement('script');

el.src = process.env.PATH + '/app.js';
document.body.appendChild(el);

var parentwindow = window.parent;
var parentdoc = window.parent.window.document;

var s = parentdoc.createElement('link');
s.type = 'text/css';
s.rel = 'stylesheet';
s.href = process.env.PATH + '/main.css';
parentdoc.head.appendChild(s);