import React, { Component, PropTypes } from 'react';

export class ADLogo extends Component {
  render () {
    return <img src="//cdn.alldebrid.com/lib/images/default/logo_alldebrid.png"/>;
  }
}
export class Form extends Component {
  render () {
    const { username, password, formDisabled } = this.props;
    const { changeUsername, changePassword, tryLogin  } = this.props;
    return (
      <div>
        <form onSubmit={tryLogin}>
          <p><input type="text" placeholder="username" onChange={changeUsername} value={username} autoFocus disabled={formDisabled} /></p>
          <p><input type="password" placeholder="password" onChange={changePassword} value={password} disabled={formDisabled} /></p>
          <Buttons isDisabled={formDisabled} />
        </form>
      </div>
    );
  }
}
Form.propTypes = {
  username: PropTypes.string,
  password: PropTypes.string,
  formDisabled: PropTypes.bool,

  changeUsername: PropTypes.func.isRequired,
  changePassword: PropTypes.func.isRequired,
  tryLogin: PropTypes.func.isRequired
};

export class Errors extends Component {
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

export class Buttons extends Component {
  render () {
    const { isDisabled } = this.props;
    const spinner = (
      <button className="btn btn-lg btn-primary">
        <span className="glyphicon glyphicon-refresh glyphicon-spin" />
      </button>
    );
    return (
      <div>
        <button className="btn btn-lg btn-primary" disabled={isDisabled}>Login</button>
        {isDisabled ? spinner : null}
      </div>
    );
  }
}
Buttons.propTypes = {
  isDisabled: PropTypes.bool.isRequired
};

export class Register extends Component {
  render () {
    return <p>Register to AllDebrid <a href="//alldebrid.com/register/">here</a></p>;
  }
}
