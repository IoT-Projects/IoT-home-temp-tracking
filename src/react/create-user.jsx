'use strict';
var React = require('react');
var Actions = require('../js/lib/actions');
var Store = require('../js/lib/stores');

module.exports = React.createClass({
    onCreate: function(e) {
        e.preventDefault();
        var target = e.currentTarget;
        var inputs = target.querySelectorAll('input, select');
        Store.create(inputs[0].value, inputs[1].value);
    },
    render: function() {
        return (
            <form className="form-signin" onSubmit={this.onCreate}>
                <h2 className="form-signin-heading">Please sign in</h2>
                <label htmlFor="inputEmail" className="sr-only">First Name</label>
                <input type="text" id="inputEmail" className="form-control" placeholder="First Name" required autofocus/>
                <label htmlFor="inputPassword" className="sr-only">Role</label>
                <select name="role">
                    <option value="2">User</option>
                    <option value="1">Admin</option>
                </select>
                <button className="btn btn-lg btn-primary btn-block" type="submit">Create</button>
            </form>
        );
    }
});
