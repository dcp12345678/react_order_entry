import request from 'superagent';
import moment from 'moment';
import Config from '../config';

class OrdersApi {

  getOrder(orderId) {
    const url = `${Config.restApi.baseUrl}/orderData/${orderId}`;
    return request
      .get(url)
      .query({ts: moment().valueOf()});
  }
  getOrdersForUser(userId) {
    const url = `${Config.restApi.baseUrl}/orderData/user/${userId}`;
    return request
      .get(url)
      .query({ts: moment().valueOf()});
  }

  getOrderLineItems(orderId) {
    const url = `${Config.restApi.baseUrl}/orderData/lineItems/${orderId}`;
    return request
      .get(url)
      .query({ts: moment().valueOf()});
  }

  saveOrder(order) {
    // alert('inside OrdersApi.saveOrder');
    const url = `${Config.restApi.baseUrl}/orderData/save`;
    return request
      .post(url)
      .send({ts: moment().valueOf()})
      .send(order);
  }

  searchOrders(criteria) {
    // alert(`criteria = ${JSON.stringify(criteria, null, 2)}`);
    const url = `${Config.restApi.baseUrl}/orderData/search`;
    return request
      .get(url)
      .query({ts: moment().valueOf()})
      .query(criteria);
  }
}

export default OrdersApi;
