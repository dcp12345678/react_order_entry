import React, {Component} from 'react';
import {hashHistory} from 'react-router';
import Helper from '../helpers/Helper';

class Logout extends Component {

  componentDidMount() {
    Helper.removeSessionStorageObject('userDetails');
    hashHistory.push('/login');
  }

  render() {
    return <h3>logout</h3>;
  }
}

export default Logout;
