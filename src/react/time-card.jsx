'use strict';
var React = require('react');
var Actions = require('../js/lib/actions');
var Store = require('../js/lib/stores');

var Times = require('./times.jsx');

module.exports = React.createClass({
    getInitialState:function() {
        return {
            name: null,
            userId: null,
            role: null,
            timeState: 'In'
        };
    },
    componentDidMount: function() {
        this.unsubscribe = Store.listen(this.onChange);
        var userInfo = Store.getUserInfo();
        this.setState({
            name: userInfo.Name,
            userId: userInfo.Id,
            role: userInfo.Role,
            timeState: Store.getTimeState()
        });
    },
    componentWillUnmount: function() {
        this.unsubscribe();
    },
    onChange: function() {
        console.log('change');
        //this.setState({needsSignin: Store.isSignedIn()});
    },
    signOut: function(e) {
        e.preventDefault();
        Store.signOut();
    },
    TrackTime: function() {
        Store.trackTime();
        var state = (this.state.timeState === 'In') ? 'Out' : 'In';
        this.setState({
            timeState: state
        });
    },
    render: function() {
        return (
            <div className="time-card">
                <h3>
                    Welcome {this.state.name}
                    <small className="signout"><a href="#" onClick={this.signOut}>Sign Out</a></small>
                </h3>
                <button onClick={this.TrackTime} className="btn btn-success btn-lg btn-block">Clock {this.state.timeState}</button>
                <Times/>
            </div>
        );
    }
});
