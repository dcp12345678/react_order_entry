import request from 'superagent';
import moment from 'moment';
import Config from '../config';

class LookupApi {

  binaryParser = (res, callback) => {
    debugger;
    res.setEncoding('binary');
    res.data = '';
    res.on('data', function (chunk) {
      res.data += chunk;
    });
    res.on('end', function () {
      callback(null, new Buffer(res.data, 'binary'));
    });
  }

  getColors() {
    const url = `${Config.restApi.baseUrl}/lookupData/colors`;
    return request
      .get(url)
      .query({ ts: moment().valueOf() });
  }

  getProductTypes() {
    const url = `${Config.restApi.baseUrl}/lookupData/productTypes`;
    return request
      .get(url)
      .query({ ts: moment().valueOf() });
  }

  getProductsForProductType(productTypeId) {
    const url = `${Config.restApi.baseUrl}/lookupData/products/${productTypeId}`;
    return request
      .get(url)
      .query({ ts: moment().valueOf() });
  }

  // get product image file for given product id
  getProductImage(productId) {
    const url = `${Config.restApi.baseUrl}/lookupData/productImage/${productId}`;
    return request
      .get(url)
      .type('jpg')
      .buffer()
      .parse(this.binaryParser)
      .query({ ts: moment().valueOf() });
  }

}

export default LookupApi;
