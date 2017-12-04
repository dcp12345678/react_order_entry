import React, {Component} from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import ClassNames from 'classnames';
import {Table, Grid, Row, Col} from 'react-bootstrap';
import {Link} from 'react-router';
import {ToastContainer, ToastMessage} from 'react-toastr';
import OrdersApi from '../api/OrdersApi';
import Helper from '../helpers/Helper';

const ToastMessageFactory = React.createFactory(ToastMessage.animation);
const ordersApi = new OrdersApi();

class RecentOrders extends Component {

  constructor(props) {
    super(props);

    this.state = {orders: []};
  }

  componentDidMount() {
    this.getOrders();
  }

  getOrders = () => {
    ordersApi.getOrdersForUser(this.props.userId).then((res) => {
      const orders = JSON.parse(res.text);
      // alert('orders = ' + JSON.stringify(orders));
      this.setState({orders});
    }).catch((err) => {
      this.toastContainer.error('',
        `${err.response || '-- could not get orders for user'}`, {
          timeOut: 3000,
          preventDuplicates: false,
        });
    });
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
          <ToastContainer
            toastMessageFactory={ToastMessageFactory}
            ref={(element) => (this.toastContainer = element)} className="toast-top-right"
          />
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
