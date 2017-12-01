import React, {Component} from 'react';
import Helper from '../helpers/Helper';
import RecentOrders from './RecentOrders';

class MainForm extends Component {

  constructor(props) {
    super(props);

    // initial state
    this.state = {};
  }

  render() {
    const navbarInstance = Helper.buildNavBar(['newOrder', 'searchOrders', 'logout']);
    return (
      <div>
        {navbarInstance}
        <RecentOrders userId={Helper.getSessionStorageObject('userDetails').userId} />
      </div >
    );
  }
}

export default MainForm;
