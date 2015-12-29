'use strict';
var React = require('react');
var Actions = require('../js/lib/actions');
var Store = require('../js/lib/stores');

var TimeCard = require('./time-card.jsx');
var Signin = require('./sign-in.jsx');

module.exports = React.createClass({
    getInitialState:function() {
        return {
            needsSignin: Store.isSignedIn()
        };
    },
    componentDidMount: function() {
        this.unsubscribe = Store.listen(this.onChange);
    },
    componentWillUnmount: function() {
        this.unsubscribe();
    },
    onChange: function() {
        this.setState({needsSignin: Store.isSignedIn()});
    },
    render: function() {
        return (
            <div className="container">
                {
                    this.state.needsSignin ? <TimeCard/> : <Signin/>
                }
            </div>
        );
    }
});
