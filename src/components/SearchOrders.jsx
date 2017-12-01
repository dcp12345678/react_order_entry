import 'react-datepicker/dist/react-datepicker.css';
import React, {Component} from 'react';
import _ from 'lodash';
import ClassNames from 'classnames';
import {Table, Grid, Row, Col, Button} from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import co from 'co';
import moment from 'moment';
import NumericInput from 'react-numeric-input';
import {Link, browserHistory} from 'react-router';
import OrdersApi from '../api/OrdersApi';
import Helper from '../helpers/Helper';

const ordersApi = new OrdersApi();

class SearchOrders extends Component {

  constructor(props) {
    super(props);

    this.state = {
      orders: [],
      orderId: null,
      createDateStart: '',
      createDateEnd: '',
      searchWasPerformed: false,
      showModalForError: false,
    };
  }

  search = () => {
    const criteria = {};
    if (this.state.orderId !== null) {
      criteria.id = this.state.orderId;
    }
    if (this.state.createDateStart !== '') {
      criteria.createDateStart = moment(this.state.createDateStart).format('YYYY-MM-DD');
    }
    if (this.state.createDateEnd !== '') {
      criteria.createDateEnd = moment(this.state.createDateEnd).format('YYYY-MM-DD');
    }
    const self = this;
    co(function* doSearch() {
      const res = yield ordersApi.searchOrders(criteria);
      const orders = JSON.parse(res.text).orders;
      // alert(`search result = ${JSON.stringify(orders, null, 2)}`);
      self.setState({orders, searchWasPerformed: true});
    }).catch((err) => {
      self.setState(
        {
          showModalForError: true,
          errorModalTitle: 'Error searching for orders',
          errorModalBody: `Error details: ${err.message} ${err.stack}`,
        });
    });
  }

  clear = () => {
    this.setState({orders: [], orderId: null, createDateStart: '', createDateEnd: '', searchWasPerformed: false});
  }

  handleCreateDateStartChanged = (date) => {
    this.setState({createDateStart: date});
  }

  handleCreateDateEndChanged = (date) => {
    this.setState({createDateEnd: date});
  }

  handleOrderIdChanged = (id) => {
    this.setState({orderId: id});
  }

  render() {
    if (this.state.showModalForError) {
      return Helper.showError(
        () => this.setState({showModalForError: false}),
        this.state.errorModalTitle,
        this.state.errorModalBody);
    }

    const cls = ClassNames('col-centered', 'text-align-left');

    // alert(`this.state.orders = ${JSON.stringify(this.state.orders, null, 2)}`);

    let orders = (<div />);
    if (this.state.orders.length > 0) {
      const rows = _.map(this.state.orders, (order) => (
        <tr>
          <td>{order.id}</td>
          <td>{Helper.formatDate(order.createDate)}</td>
          <td>{Helper.formatDate(order.updateDate)}</td>
          <td><Link to={`/orderDetails/${order.id}`}>View Order Details</Link></td>
        </tr>));

      orders = (
        <div className="top20">
          <Grid className={cls}>
            <Row>
              <Col sm={6}>
                <Table striped bordered condensed hover>
                  <thead>
                    <tr>
                      <th>Order Id</th>
                      <th>Create Date</th>
                      <th>Update Date</th>
                      <th />
                    </tr>
                  </thead>
                  <tbody>
                    {rows}
                  </tbody>
                </Table>
              </Col>
            </Row>
          </Grid>
        </div>);
    } else if (this.state.searchWasPerformed) {
      orders = (<div className="top20"><h4>No orders found for given search criteria</h4></div>);
    }

    const navbarInstance = Helper.buildNavBar(['newOrder', 'logout']);

    return (
      <div>
        {navbarInstance}
        <h3>Search Orders</h3>
        <Grid className={cls}>
          <Row>
            <Col className="text-align-right" sm={2}>
              <label>Order Id</label>
            </Col>
            <Col sm={10}>
              <NumericInput min={0} value={this.state.orderId} onChange={this.handleOrderIdChanged} />
            </Col>
          </Row>
          <Row className="top10">
            <Col className="text-align-right" sm={2}>
              <label>Created between</label>
            </Col>
            <Col sm={10}>
              <DatePicker
                dateFormat="YYYY-MM-DD" selected={this.state.createDateStart}
                onChange={this.handleCreateDateStartChanged}
              />
              <label className="left5">and</label>
              <DatePicker
                dateFormat="YYYY-MM-DD" className="left5" selected={this.state.createDateEnd}
                onChange={this.handleCreateDateEndChanged}
              />
              <label style={{fontSize: '12px', fontStyle: 'italic', color: 'blue'}} className="left5">enter dates as YYYY-MM-DD</label>
            </Col>
          </Row>
          <Row className="top10">
            <Col xsOffset={2} sm={10}>
              <Button bsStyle="primary" bsSize="small" onClick={this.search}>Search</Button>
              <Button className="left5" bsStyle="primary" bsSize="small" onClick={this.clear}>Clear</Button>
              <Button className="left5" bsStyle="primary" bsSize="small" onClick={browserHistory.goBack}>Cancel</Button>
            </Col>
          </Row>
        </Grid>
        {orders}
      </div>
    );
  }
}

export default SearchOrders;
