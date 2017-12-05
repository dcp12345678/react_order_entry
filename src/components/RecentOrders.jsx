import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import ClassNames from 'classnames';
import { Table, Grid, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router';
import { ToastContainer, toast } from 'react-toastify';
import OrdersApi from '../api/OrdersApi';
import Helper from '../helpers/Helper';

const ordersApi = new OrdersApi();

class RecentOrders extends Component {

  constructor(props) {
    super(props);

    this.state = { orders: [] };
  }

  componentDidMount() {
    this.getOrders();
  }

  getOrders = async () => {
    try {
      let res = await ordersApi.getOrdersForUser(this.props.userId);
      const orders = JSON.parse(res.text);
      // alert('orders = ' + JSON.stringify(orders));
      this.setState({ orders });
    } catch (err) {
      toast.error(`${'could not get orders for user--' + err.status + '-' + err.description}`);
    }
  }

  render() {
    const rows = _.map(this.state.orders, (order) => (
      <tr>
        <td>{order.id}</td>
        <td>{Helper.formatDate(order.createDate)}</td>
        <td>{Helper.formatDate(order.updateDate)}</td>
        <td><Link to={`/orderDetails/${order.id}`}>View Order Details</Link></td>
      </tr>));

    const cls = ClassNames('col-centered', 'text-align-left');
    return (
      <div>
        <h3>Recent Orders</h3>
        <div>
          <ToastContainer position={toast.POSITION.TOP_CENTER} autoClose={5000} />
        </div>
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
      </div >
    );
  }
}

RecentOrders.propTypes = {
  userId: PropTypes.number,
};

export default RecentOrders;
