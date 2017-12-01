import React, {Component} from 'react';
import {hashHistory} from 'react-router';
import {ToastContainer, ToastMessage} from 'react-toastr';
import AuthApi from '../api/AuthApi';
import Helper from '../helpers/Helper';

const ToastMessageFactory = React.createFactory(ToastMessage.animation);
const authApi = new AuthApi();

class Login extends Component {

  constructor(props) {
    super(props);

    // initial state
    this.state = {loginId: '', password: ''};
  }

  componentDidMount() {
    this.loginIdInput.focus();
  }

  setLoginId = (event) => {
    this.setState({loginId: event.target.value});
  }

  setPassword = () => {
    // another way to get the value, instead of event.target.value
    // const domNode = ReactDOM.findDOMNode(this.passwordInput);
    // const value = domNode.value;
    const value = this.passwordInput.value;
    this.setState({password: value});
  }

  doLogin = (event) => {
    event.preventDefault();
    if (Helper.isNullOrWhitespace(this.state.loginId) || Helper.isNullOrWhitespace(this.state.password)) {
      this.toastContainer.error('',
        'You must enter a login Id and password!', {
          timeOut: 2000,
          preventDuplicates: false,
        });
    } else {
      authApi.login(this.state.loginId, this.state.password).then((loginResult) => {
        const obj = JSON.parse(loginResult.text);
        // this.props.auth.setToken(authResult.accessToken);
        if (obj.result === 'successful login') {
          Helper.setSessionStorageObject('userDetails', {userId: obj.userId, sessionId: obj.sessionId});
          hashHistory.push('/main');
        } else {
          this.toastContainer.error('',
            obj.result, {
              timeOut: 3000,
              preventDuplicates: false,
            });
          hashHistory.push('/login');
        }
      }).catch((err) => {
        this.toastContainer.error('',
          `${err.response || '-- could not login'}`, {
            timeOut: 3000,
            preventDuplicates: false,
          });
      });
    }
  }

  render() {
    return (
      <div>
        <h2>Please enter your login credentials:</h2>
        <div>
          <ToastContainer
            toastMessageFactory={ToastMessageFactory}
            ref={(element) => (this.toastContainer = element)} className="toast-top-right"
          />
        </div>

        <form>
          <div className="container-fluid">
            <div className="row top5">
              <div className="col-sm-5 text-right top2">Login Id</div>
              <div className="col-sm-7 text-left"><input type='text' ref={(element) => (this.loginIdInput = element)} onChange={this.setLoginId} /></div>
            </div>
            <div className="row top5">
              <div className="col-sm-5 text-right top2">Password</div>
              <div className="col-sm-7 text-left"><input type='password' ref={(element) => (this.passwordInput = element)} onChange={this.setPassword} /></div>
            </div>
            <div className="row top5">
              <div className="col-sm-7 col-sm-offset-5 text-left"><button type="submit" className="btn-success" onClick={this.doLogin}>Login</button></div>
            </div>
          </div>
        </form>
      </div >
    );
  }
}

export default Login;
