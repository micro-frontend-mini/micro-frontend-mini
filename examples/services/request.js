import axios from 'axios';
import assign from 'object-assign';
import cookies from 'js-cookie';
import { passport } from '~/utils/hosts';
import urlsWithoutInvalidParamsFilter from '~/config/urlsWithoutInvalidParamsFilter';
import { removeInvalidParams } from './functions';

const request = axios.create({
  withCredentials: false,
  timeout: 30000,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'content-type': 'application/json',
  },
});

request.interceptors.request.use((config) => {
  const reDefineConfig = assign({}, config);
  const {
    url,
    method,
  } = reDefineConfig;
  const token = cookies.get('token') || '';

  reDefineConfig.headers.referUrl = window.location.href;
  reDefineConfig.headers.token = token;
  if (String(method).toUpperCase() === 'GET') {
    // hack 解决 bendbff node 转发 get 请求 411 报错问题，临时方案
    reDefineConfig.headers['content-type'] = 'text/plain';
  }

  reDefineConfig.data = reDefineConfig.data || {};
  reDefineConfig.params = reDefineConfig.params || {};

  // 统一拦截删掉值为 null 或者 undefined 的参数
  // 不需要做此操作的 url 可以配置在 urlsWithoutInvalidParamsFilter 白名单里
  if (urlsWithoutInvalidParamsFilter.indexOf(url) !== -1) {
    if (reDefineConfig.data) {
      reDefineConfig.data = removeInvalidParams(reDefineConfig.data);
    }
    if (reDefineConfig.params) {
      reDefineConfig.params = removeInvalidParams(reDefineConfig.params);
    }
  }

  return reDefineConfig;
}, (error) => Promise.reject(error));

/**
 * 接口返回数据统一处理，这里需要兼容2种数据格式
 *  格式1（.net 接口），如下以 code 来判断接口返回数据
 *    {
 *      data: {
 *        data,
 *        code,
 *        msg,
 *      },
 *    }
 *  格式2（Java 接口），如下以是否存在 success 字段来返回数据给业务使用
 *    {
 *      data: {
 *        success,
 *        data,
 *        code,
 *        msg,
 *      },
 *    }
 */
function checkResponse(response) {
  const {
    data: {
      code,
      success,
      msg,
    },
    config: {
      url,
    },
  } = response;
  const innerDataCode = Number(code);
  const errorCb = () => {
    if (innerDataCode === 702) { // 登陆失效
      window.location.href = `${passport}/sso?sid=10&fromurl=${encodeURIComponent(window.location.href)}`;
      return;
    }
    console.error(`
        XHR request error, the request url is ${url},
        code is ${code},
        msg is ${msg}`);
    // eslint-disable-next-line
    return Promise.reject({ ...response.data, message: response.data.message || response.data.msg });
  };

  if (!success) {
    return errorCb();
  }
  return response.data;
}

// 拦截器,response之后
request.interceptors.response.use((response) => checkResponse(response), (e) => Promise.reject(e));

export default request;
