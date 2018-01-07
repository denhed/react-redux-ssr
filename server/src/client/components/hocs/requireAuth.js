import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

export default (ChildComponent) => {
    class RequireAuth extends Component {
        render() {
            switch (this.props.auth) {
                case false:
                    // when <Redirect /> is shown it automatically send user to new page.
                    return <Redirect to="/"/>;
                case null:
                    // user is not authenticated yet.
                    return <div>Loading...</div>;
                default:
                    // user is authenticated.
                    return <ChildComponent {...this.props}/>
            }
        }
    }

    function mapStateToProps({ auth }) {
        return { auth };
    }

    return connect(mapStateToProps)(RequireAuth);
};