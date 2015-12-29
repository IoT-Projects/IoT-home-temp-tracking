'use strict';
var React = require('react');
var Actions = require('../js/lib/actions');
var Store = require('../js/lib/stores');

module.exports = React.createClass({
    getInitialState:function() {
        return {
            error: null
        };
    },
    onSignin: function(e) {
        e.preventDefault();
        var target = e.currentTarget;
        var inputs = target.querySelectorAll('input');
        Store.signIn(inputs[0].value, inputs[1].value);
    },
    componentDidMount: function() {
        this.unsubscribe = Store.listen(this.onChange);
    },
    componentWillUnmount: function() {
        this.unsubscribe();
    },
    onChange: function(info) {
        if(info.error) {
            this.setState(info);
        }
    },
    clearError: function() {
        this.setState({error: null});
    },
    render: function() {
        return (
            <form className="form-signin" onSubmit={this.onSignin} onChange={this.clearError}>
                {this.state.error ? <div className="alert alert-danger" role="alert">{this.state.error}</div> : ''}
                <h2 className="form-signin-heading">Please sign in</h2>
                <label htmlFor="inputEmail" className="sr-only">First Name</label>
                <input type="text" id="inputEmail" className="form-control" placeholder="First Name" required autofocus/>
                <label htmlFor="inputPassword" className="sr-only">Pin</label>
                <input type="number" id="inputPassword" className="form-control" placeholder="Pin" required pattern="[0-9]*" inputmode="numeric"/>
                <button className="btn btn-lg btn-primary btn-block" type="submit">Sign in</button>
            </form>
        );
    }
});
