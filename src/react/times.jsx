'use strict';
var React = require('react');
var Actions = require('../js/lib/actions');
var Store = require('../js/lib/stores');

var moment = require('moment');

module.exports = React.createClass({
    getInitialState:function() {
        return {
            times: []
        };
    },
    componentDidMount: function() {
        this.unsubscribe = Store.listen(this.onChange);
        this.onChange();
    },
    componentWillUnmount: function() {
        this.unsubscribe();
    },
    onChange: function() {
        var userId = Store.getUserInfo().Id;
        var self = this;
        fetch('/crud.php/times?userId=' + userId).then(function(response) {
            return response.json();
        }).then(function(j) {
            self.setState({times: j});
        });
    },
    TrackTime: function() {
        Store.trackTime();
        var state = (this.state.timeState === 'In') ? 'Out' : 'In';
        this.setState({
            timeState: state
        });
    },
    render: function() {
        var data = this.state.times;
        var totalTime = 0;
        var times = data.map(function(data, i) {
            var outTime = '';
            var inTime = moment(data.TimeIn).format("MM/DD/YYYY hh:mm a");
            var timeDiff = '';
            if(data.TimeOut) {
                var b = moment(data.TimeIn);
                var a = moment(data.TimeOut);
                var diff = a.diff(b, 'hours', true);
                timeDiff = +Math.max( Math.round( diff * 10) / 10).toFixed(1);
                console.log(timeDiff);
                totalTime = totalTime + timeDiff;
                totalTime = +Math.max( Math.round( totalTime * 10) / 10).toFixed(1);
                outTime = moment(data.TimeOut).format("MM/DD/YYYY hh:mm a");
            }
            return (
                <li className="list-group-item" key={data.Id}>
                    {data.TimeOut ? <span className="badge">{timeDiff}<br/> hours</span> : ''}
                    In: {inTime} <br/> Out: {outTime}
                </li>
            );
        });
        return (
            <div className="time-list">
                <h4>Time Card</h4>
                <ul className="list-group">
                    {times}
                </ul>
                <h4 className="total-time">Total Hours: {totalTime}</h4>
            </div>
        );
    }
});
