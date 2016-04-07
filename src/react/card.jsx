'use strict';
var React = require('react');
var moment = require('moment');
var Store = require('../js/lib/stores');

module.exports = React.createClass({
    //getInitialState:function() {
    //    return {
    //        locations: []
    //    };
    //},
    //componentDidMount: function() {
    //    this.unsubscribe = Store.listen(this.onChange);
    //},
    //componentWillUnmount: function() {
    //    this.unsubscribe();
    //},
    locationSelection: function(e) {
        e.preventDefault();
        var target = e.currentTarget;
        var deviceId = target.getAttribute('data-id');
        Store.getDataFor(deviceId);
    },
    render: function() {
        console.log(this.props);
        var timestamp = moment(this.props.data.Timestamp).format('MMM D, h:mm:ss a');
        return (
            <a data-id={this.props.data.deviceId} href="#" onClick={this.locationSelection} className="card medium">
                <div className="cardDetails">
                    <span className="locationId">{this.props.data.deviceId}</span>
                    <span className="title">{this.props.data.Location}</span>
                    <span className="time">{timestamp}</span>
                    <div className="details">
                        <span>{this.props.data.Temperature}&deg;</span>
                        <span>{this.props.data.Humidity}%</span>
                        <span>{this.props.data.Voltage}3.0V</span>
                    </div>
                </div>
            </a>
        );
    }
});
