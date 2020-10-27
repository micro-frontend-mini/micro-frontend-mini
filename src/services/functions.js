import assign from 'object-assign';

/**
 * 无效请求参数过滤，删除值为 null/undefined 的参数
 * @param {Object} obj 需要过滤的对象
 */
export const removeInvalidParams = (obj) => {
  if (typeof obj !== 'object') {
    // 不处理非对象
    return obj;
  }
  if (Array.isArray(obj)) {
    // 不处理数组
    return obj;
  }
  const reDefinedParams = assign({}, obj);
  Object.keys(reDefinedParams).forEach((key) => {
    if (reDefinedParams[key] === null || reDefinedParams[key] === undefined) {
      delete reDefinedParams[key];
    }
    if (typeof reDefinedParams[key] === 'object') {
      reDefinedParams[key] = removeInvalidParams(reDefinedParams[key]);
    }
  });
  return reDefinedParams;
};

export default {
  removeInvalidParams,
};
