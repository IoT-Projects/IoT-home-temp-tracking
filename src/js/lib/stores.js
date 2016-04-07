// basic store, not compleate
'use strict';
var Reflux = require('reflux');
var Actions = require('./actions');
var moment = require('moment');

var _locations = [];

module.exports = Reflux.createStore({
    init: function() {
        this.listenTo(Actions.ClockIn, this.onCreate);
        this.listenTo(Actions.ClockOut, this.onEdit);
        this.getLocationsData();
    },
    // called on save
    onCreate: function(info) {
    },
    // called on edit save
    onEdit: function(info) {
    },
    getUserInfo: function() {
        return JSON.parse(localStorage.timeTracker);
    },
    getDataFor: function(deviceId) {
        console.log(deviceId);
        //var self = this;
        //fetch('/crud.php/login', {
        //    method: 'POST',
        //    body: JSON.stringify({
        //        name: name,
        //        pin: pin
        //    })
        //}).then(function(response) {
        //    return response.json();
        //}).then(function(j) {
        //    if(!j.error) {
        //        j.signinDate = Date.now();
        //        localStorage.timeTracker = JSON.stringify(j);
        //    }
        //    self.trigger(j);
        //});
    },
    getLocations: function() {
        return _locations;
    },
    // called on load from jsx template
    getLocationsData: function() {
        var self = this;
        fetch('/api.php/list/locations').then(function(response) {
            return response.json();
        }).then(function(j) {
            _locations = j;
            self.trigger();
        });
    },
    signOut: function() {
        delete localStorage.timeTracker;
        this.trigger();
    },
    getTimeState: function() {
        //if(_info[0].In && !_info[0].Out) {
        //    return 'Out';
        //} else {
            return 'In';
        //}
    },
    trackTime: function() {
        var clockTime = moment().format('YYYY/MM/DD HH:mm');
        var userId = this.getUserInfo().Id;
        var self = this;
        fetch('/crud.php/time/track?userId=' + userId + '&time=' + clockTime).then(function(response) {
            return response.json();
        }).then(function(j) {
            //_info = j;
            self.trigger();
        });
    }
});
