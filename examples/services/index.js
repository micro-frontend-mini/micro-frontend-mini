import assign from 'object-assign';
import axios from './request';

const globalServices = {
  fetchUserInfo: {
    method: 'get',
    url: '/api/fetchSchoolUserInfo',
    mockUrl: '/mock/922/getSchoolUserInfo',
  },
};
const api = {};
const IS_MOCK = process.env.BUILD_ENV === 'mock' || window.location.href.indexOf('mock.com') !== -1;
const urlsAllThere = {};
api.getUrl = (key) => urlsAllThere[key].url;
export const generator = (urls) => {
  const mergedUrls = {
    ...globalServices,
    ...urls,
  };
  const generalUrl = (key) => {
    const {
      method, url, mockUrl,
    } = mergedUrls[key];

    if (IS_MOCK) {
      return {
        method: method || 'get',
        url: mockUrl || url,
      };
    }
    return {
      method,
      url,
    };
  };

  Object.keys(mergedUrls).forEach((item) => {
    urlsAllThere[item] = mergedUrls[item];
    const localItem = generalUrl(item);
    const { method } = localItem;
    switch (String(method).toUpperCase()) {
      case 'POST':
      case 'PUT':
      case 'PATCH':
        api[item] = (params) => axios(assign({}, localItem, {
          data: params,
        }));
        break;
      default:
        api[item] = (params) => axios(assign({}, localItem, {
          params,
        }));
    }
  });

  return api;
};

generator(globalServices);

export default api;
