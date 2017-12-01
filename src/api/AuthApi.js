import request from 'superagent';
import moment from 'moment';
import Config from '../config';

class AuthApi {

  login(username, password) {
    const url = `${Config.restApi.baseUrl}/auth/login`;
    return request
      .post(url)
      .send({ts: moment().valueOf()})
      .send({username, password});
  }
}

export default AuthApi;
