import React, {Component} from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import co from 'co';
import update from 'immutability-helper';
import {Table, Grid, Row, Col, Button, Modal} from 'react-bootstrap';
import {ToastContainer, ToastMessage} from 'react-toastr';
import {hashHistory} from 'react-router';
import OrdersApi from '../api/OrdersApi';
import LookupApi from '../api/LookupApi';
import Helper from '../helpers/Helper';

const ordersApi = new OrdersApi();
const lookupApi = new LookupApi();

const ToastMessageFactory = React.createFactory(ToastMessage.animation);

/**
 * This component is used for editing orders
 */
class EditOrder extends Component {

  /**
   * Constructs a new instance of this class.
   * @param {any} props the properties
   * @constructor
   */
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      showModalForDelete: false,
      showModalForSave: false,
      showModalForError: false,
      isNew: this.props.params.id === '-1',
    };

    const self = this;
    co(function* init() {
      let res = yield lookupApi.getColors();
      const colors = JSON.parse(res.text);
      res = yield lookupApi.getProductTypes();
      const productTypes = JSON.parse(res.text);
      self.setState({colors, productTypes});

      let order;
      if (!self.state.isNew) {
        // editing an existing order
        const x = yield ordersApi.getOrder(self.props.params.id);
        order = JSON.parse(x.text);

        // get available products for each line item on the order
        const promiseResults =
          yield _.map(order.lineItems, (lineItem) => lookupApi.getProductsForProductType(lineItem.productTypeId));
        _.forEach(order.lineItems, (lineItem, index) => {
          lineItem.availProducts = JSON.parse(promiseResults[index].text);
        });
      } else {
        // create a new order
        order = {};
        order.id = -1;
        order.lineItems = [];
      }
      order.userId = Helper.getSessionStorageObject('userDetails').userId;
      self.setState({order, isLoaded: true});
    }).catch((err) => {
      self.setState(
        {
          showModalForError: true,
          errorModalTitle: 'Error initializing form',
          errorModalBody: `Error details: ${err.message} ${err.stack}`,
        });
    });
  }

  /**
   * Saves the order to persistence
   */
  saveOrder = () => {
    const self = this;
    co(function* save() {
      const res = yield ordersApi.saveOrder(self.state.order);
      const resObj = JSON.parse(res.text);
      self.setState({
        showModalForSave: true,
        order: update(self.state.order, {
          id: {$set: parseInt(resObj.orderId, 10)},
        }),
      });
    }).catch((err) => {
      self.setState(
        {
          showModalForError: true,
          errorModalTitle: 'Error saving order',
          errorModalBody: `Error details: ${err.message} ${err.stack}`,
        });
    });
  }

  /**
   * Takes user back to main page
   */
  gotoMainPage = () => {
    hashHistory.push('/main');
  }

  /**
   * Adds a line item to the line items grid
   */
  addLineItem = () => {
    const lineItems = this.state.order.lineItems;
    const id = lineItems.length === 0 ? 0 : lineItems[lineItems.length - 1].id + 1;
    const updatedLineItems = update(lineItems, {
      $push: [
        {
          id,
          productTypeId: -1,
          productId: -1,
          availProducts: [],
          colorId: -1,
        },
      ],
    });
    this.setState({
      order: update(this.state.order, {lineItems: {$set: updatedLineItems}}),
    });
  }

  /**
   * Called when user changes the product type for a line item
   */
  onProductTypeChanged = (lineItem) => {
    const selProductType = `selProductType_${lineItem.id}`;
    const lineItems = this.state.order.lineItems;
    const self = this;

    co(function* handleChange() {
      const res = yield lookupApi.getProductsForProductType(self[selProductType].value);
      const productTypeId = parseInt(self[selProductType].value, 10);
      const products = JSON.parse(res.text);
      const updatedLineItem = update(lineItem,
        {
          availProducts: {$set: products},
          productTypeId: {$set: productTypeId},
          productId: {$set: -1}, // deselect any previously selected product
          colorId: {$set: -1}, // deselect any previously selected color
        }
      );
      const index = _.findIndex(lineItems, ['id', lineItem.id]);
      const updatedLineItems = update(lineItems, {$splice: [[index, 1, updatedLineItem]]});
      const updatedOrder = update(self.state.order, {lineItems: {$set: updatedLineItems}});
      self.setState({order: updatedOrder});
    });
  }

  /**
   * Called when user changes the product for a line item
   */
  onProductChanged = (lineItem) => {
    const selProduct = `selProduct_${lineItem.id}`;
    const lineItems = this.state.order.lineItems;
    const productId = parseInt(this[selProduct].value, 10);
    const updatedLineItem = update(lineItem, {productId: {$set: productId}});
    const index = _.findIndex(lineItems, ['id', lineItem.id]);
    const updatedLineItems = update(lineItems, {$splice: [[index, 1, updatedLineItem]]});
    const updatedOrder = update(this.state.order, {lineItems: {$set: updatedLineItems}});
    this.setState({order: updatedOrder});
  }

  /**
   * Called when user changes the color for a line item
   */
  onColorChanged = (lineItem) => {
    const selColor = `selColor_${lineItem.id}`;
    const lineItems = this.state.order.lineItems;
    const colorId = parseInt(this[selColor].value, 10);
    const updatedLineItem = update(lineItem, {colorId: {$set: colorId}});
    const index = _.findIndex(lineItems, ['id', lineItem.id]);
    const updatedLineItems = update(lineItems, {$splice: [[index, 1, updatedLineItem]]});
    const updatedOrder = update(this.state.order, {lineItems: {$set: updatedLineItems}});
    this.setState({order: updatedOrder});
  }

  /**
   * Deletes a line item from the grid
   */
  deleteLineItem = () => {
    const lineItems = this.state.order.lineItems;
    const index = _.findIndex(lineItems, ['id', this.state.idToDelete]);
    const updatedLineItems = update(lineItems, {$splice: [[index, 1]]});
    const order = this.state.order;
    const updatedOrder = update(order, {lineItems: {$set: updatedLineItems}});
    this.setState({order: updatedOrder, idToDelete: -1, showModalForDelete: false});
  }

  /**
   * Prompts user to make sure they want to delete the line item
   * @param {Number} id the id of line item to delete
   */
  promptToDeleteLineItem = (id) => {
    this.setState({idToDelete: id, showModalForDelete: true});
  }

  /**
   * Cancels the edit operation without saving and returns to main page or order details page.
   */
  cancelSave = () => {
    if (this.state.isNew) {
      hashHistory.push('/main');
    } else {
      hashHistory.push(`/orderDetails/${this.state.order.id}`);
    }
  }

  /**
   * Renders the component content to the DOM.
   */
  render() {
    if (this.state.showModalForError) {
      return Helper.showError(
        () => this.setState({showModalForError: false}),
        this.state.errorModalTitle,
        this.state.errorModalBody);
    }

    if (!this.state.isLoaded) {
      return (<h3>loading...</h3>);
    }
    const navbarInstance = Helper.buildNavBar(['searchOrders', 'logout']);

    const rows = [];
    _.forEach(this.state.order.lineItems, (lineItem) => {
      const selProductType = `selProductType_${lineItem.id}`;
      const selProduct = `selProduct_${lineItem.id}`;
      const selColor = `selColor_${lineItem.id}`;
      rows.push(
        <tr>
          <td>{lineItem.id}</td>
          <td>
            <select
              ref={(element) => (this[selProductType] = element)}
              onChange={() => this.onProductTypeChanged(lineItem)}
            >
              {Helper.buildOptionsForSelectList(this.state.productTypes, lineItem.productTypeId)}
            </select>
          </td>
          <td>
            {/* only show products select list if a product type has been selected */}
            {lineItem.availProducts.length > 0 &&
              <select ref={(element) => (this[selProduct] = element)} onChange={() => this.onProductChanged(lineItem)} >
                {Helper.buildOptionsForSelectList(lineItem.availProducts, lineItem.productId)}
              </select>
            }
          </td>
          <td>
            {/* only show colors select list if a product type has been selected */}
            {lineItem.availProducts.length > 0 &&
              <select ref={(element) => (this[selColor] = element)} onChange={() => this.onColorChanged(lineItem)} >
                {Helper.buildOptionsForSelectList(this.state.colors, lineItem.colorId)}
              </select>
            }
          </td>
          <td><Button bsStyle="danger" bsSize="xsmall" onClick={() => this.promptToDeleteLineItem(lineItem.id)}>Delete</Button></td>
        </tr>);
    });

    return (
      <div>
        {navbarInstance}
        <h3>{this.state.isNew ? 'Create New Order' : `Edit Order ${this.props.params.id}`}</h3>
        <div>
          <ToastContainer
            toastMessageFactory={ToastMessageFactory}
            ref={(element) => (this.toastContainer = element)} className="toast-top-right"
          />
        </div>
        <Grid className="text-align-left">
          <Row>
            <Col sm={4}>
              <Button bsStyle="primary" bsSize="small" onClick={this.addLineItem}>Add Line Item</Button>
              <Button bsStyle="primary" bsSize="small" className="left5" onClick={this.saveOrder}>Save</Button>
              <Button bsStyle="primary" bsSize="small" className="left5" onClick={this.cancelSave}>Cancel</Button>
              <Button
                bsStyle="primary" bsSize="small" className="left5"
                onClick={() => this.setState({
                  showModalForError: true,
                  errorModalTitle: 'dummy title',
                  errorModalBody: 'dummy body',
                })}
              >Show Dummy Error</Button>
            </Col>
          </Row>
          <Row className="top10">
            <Col sm={8}>
              <Table striped bordered condensed hover>
                <thead>
                  <tr>
                    <th>Line Item Id</th>
                    <th>Product Type</th>
                    <th>Product Name</th>
                    <th>Color</th>
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

        <Modal show={this.state.showModalForDelete} onHide={this.close}>
          <Modal.Header closeButton>
            <Modal.Title>Confirm</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h4>Are you sure you want to delete this line item?</h4>
          </Modal.Body>
          <Modal.Footer>
            <Button bsStyle="danger" bsSize="small" onClick={this.deleteLineItem}>Yes</Button>
            <Button bsStyle="danger" bsSize="small" onClick={() => this.setState({showModalForDelete: false})}>No</Button>
          </Modal.Footer>
        </Modal>

        <Modal show={this.state.showModalForSave} onHide={this.close}>
          <Modal.Header closeButton>
            <Modal.Title>Order Saved Successfully</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h4>{this.state.isNew ? `Order has been created! Order Id is ${this.state.order.id}` : 'Order has been saved!'}</h4>
          </Modal.Body>
          <Modal.Footer>
            <Button bsStyle="danger" bsSize="small" onClick={this.gotoMainPage}>OK</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

EditOrder.propTypes = {
  params: PropTypes.object,
};

export default EditOrder;
