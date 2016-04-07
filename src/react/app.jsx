'use strict';
var React = require('react');
var Actions = require('../js/lib/actions');
var Store = require('../js/lib/stores');

var Card = require('./card.jsx');
var MainContent = require('./main-content.jsx');

module.exports = React.createClass({
    getInitialState:function() {
        return {
            locations: [],
            location: []
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
        var self = this;
        return (
            <div className="container">
                <div className="navWrapper">
                    {this.state.locations.map(function(location) {
                        return <Card key={location.Id} data={location}/>;
                    })}
                </div>
                {this.state.location ? <MainContent /> : ''}
            </div>
        );
    }
});
