'use strict';
var React = require('react');
var Actions = require('../js/lib/actions');
var Store = require('../js/lib/stores');

module.exports = React.createClass({

    onUpdate: function(e) {
        e.preventDefault();
        var target = e.currentTarget;
        var inputs = target.querySelectorAll('input');
        Store.signIn(inputs[0].value, inputs[1].value);
    },
    render: function() {
        return (
            <form className="form-signin" onSubmit={this.onUpdate}>
                <h2 className="form-signin-heading">Please sign in</h2>
                <label htmlFor="inputEmail" className="sr-only">First Name</label>
                <label htmlFor="inputPassword" className="sr-only">Pin</label>
                <input type="number" id="inputPassword" className="form-control" placeholder="Pin" required pattern="[0-9]*" inputmode="numeric"/>
                <label htmlFor="inputPassword2" className="sr-only">Re-type Pin</label>
                <input type="number" id="inputPassword2" className="form-control" placeholder="Pin" required pattern="[0-9]*" inputmode="numeric"/>
                <input type="hidden" name="userId" value={this.state.userId}/>
                <button className="btn btn-lg btn-primary btn-block" type="submit">Update</button>
            </form>
        );
    }
});
