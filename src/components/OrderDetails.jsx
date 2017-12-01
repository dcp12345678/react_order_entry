import React, { Component } from 'react';
import _ from 'lodash';
import { Table, Grid, Row, Col, Button } from 'react-bootstrap';
import { browserHistory, hashHistory } from 'react-router';
import { ToastContainer, ToastMessage } from 'react-toastr';
import Helper from '../helpers/Helper';
import OrdersApi from '../api/OrdersApi';
import Config from '../config';

const ToastMessageFactory = React.createFactory(ToastMessage.animation);
const ordersApi = new OrdersApi();

class OrderDetails extends Component {

  constructor(props) {
    super(props);
    this.state = { orderLineItems: [] };
  }

  componentDidMount() {
    this.getOrderDetails();
  }

  getOrderDetails = () => {
    ordersApi.getOrderLineItems(this.props.params.id).then((res) => {
      const orderLineItems = JSON.parse(res.text);
      this.setState({ orderLineItems });
    }).catch((err) => {
      this.toastContainer.error('',
        `${err.response || err || '-- could not get order line items for order'}`, {
          timeOut: 3000,
          preventDuplicates: false,
        });
    });
  }

  editOrder = () => {
    hashHistory.push(`/editOrder/${this.props.params.id}`);
  }

  render() {
    const navbarInstance = Helper.buildNavBar(['newOrder', 'searchOrders', 'logout']);

    // create the rows for the order line item table
    const rows = _.map(this.state.orderLineItems, (lineItem) => (
      <tr>
        <td><image height="50" width="75" src={`${Config.restApi.baseUrl}${lineItem.productImageUri}`}></image></td>
        <td>{lineItem.id}</td>
        <td>{lineItem.productTypeName}</td>
        <td>{lineItem.productName}</td>
        <td>{lineItem.colorName}</td>
      </tr>
    ));

    return (
      <div>
        {navbarInstance}
        <h3>Order Details for Order Id: {this.props.params.id}</h3>
        <div>
          <ToastContainer
            toastMessageFactory={ToastMessageFactory}
            ref={(element) => (this.toastContainer = element)} className="toast-top-right"
          />
        </div>
        <Grid className="text-align-left">
          <Row className="bottom10" >
            <Col sm={4}>
              <Button bsStyle="primary" bsSize="small" onClick={browserHistory.goBack}>Back</Button>
              <Button bsStyle="primary" className="left5" bsSize="small" onClick={this.editOrder}>Edit</Button>
            </Col>
          </Row>
          <Row>
            <Col sm={6}>
              <Table striped bordered condensed hover>
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Line Item Id</th>
                    <th>Product Type</th>
                    <th>Product Name</th>
                    <th>Color</th>
                  </tr>
                </thead>
                <tbody>
                  {rows}
                </tbody>
              </Table>
            </Col>
          </Row>
        </Grid>

      </div>
    );
  }
}

OrderDetails.propTypes = {
  params: React.PropTypes.object,
};

export default OrderDetails;
