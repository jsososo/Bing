const axios = require('axios');

module.exports = (param) => {
  let obj = param;
  if (typeof param === 'string') {
    obj = { url: param };
  }
  const { method = 'get', data = {} } = obj;
  let { url } =  obj;
  if (method === 'get') {
    url += `?${Object.keys(data).map((k) => `${k}=${encodeURI(data[k])}`).join('&')}`
  }
  return axios({
    method,
    url,
  }).then((res) => {
    res.data = res.data || {};
    if (res.data.code === 200) {
      return res.data;
    } else if (res.data.result === 400) {

    } else {
      throw({ data: res.data });
    }
  }, (err) => {
    console.log(err);
    return err;
  }).catch(err => {
    console.log(err);
    return {};
  });
}