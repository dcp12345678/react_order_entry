import React, { Component } from 'react';
import { hashHistory } from 'react-router';
import { ToastContainer, toast } from 'react-toastify';
import AuthApi from '../api/AuthApi';
import Helper from '../helpers/Helper';
import Button from 'react-bootstrap-button-loader';

const authApi = new AuthApi();

class Login extends Component {

  constructor(props) {
    super(props);

    // initial state
    this.state = { loginId: '', password: '', isLoginInProgress: false };
  }

  componentDidMount() {
    this.loginIdInput.focus();
  }

  setLoginId = (event) => {
    this.setState({ loginId: event.target.value });
  }

  setPassword = () => {
    // another way to get the value, instead of event.target.value
    // const domNode = ReactDOM.findDOMNode(this.passwordInput);
    // const value = domNode.value;
    const value = this.passwordInput.value;
    this.setState({ password: value });
  }

  doLogin = async (event) => {
    this.setState({ isLoginInProgress: true });
    event.preventDefault();
    if (Helper.isNullOrWhitespace(this.state.loginId) || Helper.isNullOrWhitespace(this.state.password)) {
      this.setState({ isLoginInProgress: false });
      toast.error('You must enter a login Id and password!', { autoClose: 3000 });
    } else {
      try {
        let loginResult = await authApi.login(this.state.loginId, this.state.password);
        const obj = JSON.parse(loginResult.text);
        if (obj.result === 'successful login') {
          this.setState({ isLoginInProgress: false });
          Helper.setSessionStorageObject('userDetails', { userId: obj.userId, sessionId: obj.sessionId });
          hashHistory.push('/main');
        } else {
          this.setState({ isLoginInProgress: false });
          toast.error(obj.result);
          hashHistory.push('/login');
        }
      } catch (err) {
        this.setState({ isLoginInProgress: false });
        toast.error(`${err.response || '-- could not login'}`, {
          autoClose: 3000
        });
      }
    }
  }

  render() {
    return (
      <div>
        <h2>Please enter your login credentials:</h2>
        <div>
          <ToastContainer position={toast.POSITION.TOP_CENTER} autoClose={5000} />
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
              <div className="col-sm-7 col-sm-offset-5 text-left"><Button type="submit" loading={this.state.isLoginInProgress} className="btn-success" onClick={this.doLogin}>Login</Button></div>
            </div>
          </div>
        </form>
      </div >
    );
  }
}

export default Login;
