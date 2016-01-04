'use strict';
var React = require('react');
var Actions = require('../js/lib/actions');
var Store = require('../js/lib/stores');

module.exports = React.createClass({
    getInitialState:function() {
        return {
            locations: []
        };
    },
    componentDidMount: function() {
        this.unsubscribe = Store.listen(this.onChange);
    },
    componentWillUnmount: function() {
        this.unsubscribe();
    },
    onChange: function() {
        this.setState({
            locations: Store.getLocations()
        });
    },
    render: function() {
        console.log(this.state.locations);
        return (
            <div className="container">
                hello
            </div>
        );
    }
});
