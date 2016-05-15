import css from '../../../css/style.scss';
import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as actions from './actions';

class ADLogo extends Component {
  render () {
    return <img src="//cdn.alldebrid.com/lib/images/default/logo_alldebrid.png"/>;
  }
}
class Form extends Component {
  render () {
    const { username, password } = this.props;
    const { changeUsername, changePassword, submitHandler } = this.props;
    return (
      <div>
        <form onSubmit={submitHandler}>
          <p><input type="text" placeholder="username" onChange={changeUsername} value={username} /></p>
          <p><input type="password" placeholder="password" onChange={changePassword} value={password} /></p>
        </form>
      </div>
    );
  }
}
Form.propTypes = {
  username: PropTypes.string,
  password: PropTypes.string,

  changeUsername: PropTypes.func.isRequired,
  changePassword: PropTypes.func.isRequired,
  submitHandler: PropTypes.func.isRequired
};

class Errors extends Component {
  render () {
    const { errors } = this.props;
    return (
      <div>
        {errors.map(err => <p key={err}>{err}</p>)}
      </div>
    );
  }
}
Errors.propTypes = {
  errors: PropTypes.arrayOf(PropTypes.string)
};

class Buttons extends Component {
  render () {
    return (
      <div>
        <button className="btn btn-lg btn-primary">Login</button>
      </div>
    );
  }
}
class Register extends Component {
  render () {
    return <p>Register to AllDebrid <a href="//alldebrid.com/register/">here</a></p>;
  }
}

class Login extends Component {
  render () {
    const { username, password } = this.props;
    const fakeErrors = ['weather changed', 'another error'];
    return (
      <div>
        <h1><ADLogo/> Login</h1>
        <Form username={username} password={password} />
        <Errors errors={fakeErrors} />
        <Buttons/>
        <Register/>
      </div>
    );
  }
}
Login.propTypes = {
  username: PropTypes.string,
  password: PropTypes.string
};

// from Handlers to ActionCreators
function changeUsername (evt) {
  return actions.changeUsername(evt.target.value);
}
function changePassword (evt) {
  return actions.changePassword(evt.target.value);
}

function mapStateToProps (state) {
  return {
    errors: state.errors,
    username: state.username,
    password: state.password
  };
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    changeUsername,
    changePassword
  }, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Login);

/* class OldLogin extends Component {
  render () {
    return (
      <div className="container-fluid">
        <div className="row login">
          <div className="col-sm-8 col-sm-offset-2 col-md-6 col-md-offset-3">
            <div className="panel panel-default">
              <div className="panel-heading">
                <strong>Alldebrid Login</strong>
              </div>
              <div className="panel-body">
                <form role="form" ng-submit="login.do()">
                  <fieldset>
                    <div className="row">
                      <div className="center-block">
                        <img className="profile-img" src="/ad/lib/images/default/logo_alldebrid.png"/>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-sm-12 col-md-10  col-md-offset-1">
                        <div className="form-group">
                          <div className="input-group">
                            <span className="input-group-addon">
                              <i className="glyphicon glyphicon-user"></i>
                            </span>
                            <input className="form-control" placeholder="Username" name="loginname" type="text" autoFocus ng-model="login.username" ng-change="login.loginFailed = false"/>
                          </div>
                        </div>
                        <div className="form-group">
                          <div className="input-group">
                            <span className="input-group-addon">
                              <i className="glyphicon glyphicon-lock"></i>
                            </span>
                            <input className="form-control" placeholder="Password" name="password" type="password" ng-model="login.password" ng-change="login.loginFailed = false"/>
                          </div>
                        </div>
                        <div className="alert alert-danger" ng-show="login.loginFailed">
                          <strong>Error!</strong> Change username/password and try submitting again.
                        </div>
                        <div className="form-group">
                          <button type="submit" className="btn btn-lg btn-primary" ng-disabled="login.loading || login.loginFailed">Log In</button>
                          <button className="btn btn-lg btn-primary" ng-show="login.loading"><span className="glyphicon glyphicon-refresh glyphicon-spin"></span></button>
                        </div>
                      </div>
                    </div>
                  </fieldset>
                </form>
              </div>
              <div className="panel-footer">
                Don't have an account? <a href="https://www.alldebrid.com/register/" target="_blank">Register on AllDebrid</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}*/
