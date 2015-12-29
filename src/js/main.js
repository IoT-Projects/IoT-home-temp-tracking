'use strict';
var React = require('react');
var app = React.createFactory(require('../react/app.jsx'));

function init() {
    React.render(app(), document.querySelector('.app'));
}

init();
