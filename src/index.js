import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/css/bootstrap-theme.min.css';
import 'animate.css/animate.css';
import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, hashHistory, IndexRedirect} from 'react-router';
import AppWrapper from './components/AppWrapper';
import Login from './components/Login';
import MainForm from './components/MainForm';
import OrderDetails from './components/OrderDetails';
import EditOrder from './components/EditOrder';
import SearchOrders from './components/SearchOrders';
import Logout from './components/Logout';
import Helper from './helpers/Helper';
import './index.css';

const checkIfLoggedIn = (nextState, replace) => {
  // alert('inside checkIfLoggedIn, nextState.location.pathname = ' + nextState.location.pathname);
  const loggedIn = Helper.getSessionStorageObject('userDetails') || false;
  if (loggedIn && nextState.location.pathname === '/login') {
    // they're already logged in, so don't go to login page again, just go to main page
    replace({pathname: '/main'});
  } else if (!loggedIn && nextState.location.pathname !== '/login') {
    // don't let them access the page unless they're logged in
    replace({pathname: '/login'});
  }
};

const routes = (
  <Router history={hashHistory}>
    <Route path="/" component={AppWrapper}>
      <IndexRedirect to="/login" />
      <Route path="login" component={Login} onEnter={checkIfLoggedIn} />
      <Route path="main" component={MainForm} onEnter={checkIfLoggedIn} />
      <Route path="orderDetails/:id" component={OrderDetails} onEnter={checkIfLoggedIn} />
      <Route path="editOrder/:id" component={EditOrder} onEnter={checkIfLoggedIn} />
      <Route path="searchOrders" component={SearchOrders} onEnter={checkIfLoggedIn} />
      <Route path="logout" component={Logout} />
    </Route>
  </Router>
);

ReactDOM.render(
  routes,
  document.getElementById('root')
);
