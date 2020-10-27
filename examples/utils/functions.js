/**
 * 给 DOM 对象添加事件监听函数
 * @param {String} name 事件名称
 * @param {*} callback 时间监听函数
 * @param {*} element 对应 DOM 元素
 * @param {*} useCapture 是否捕获方式
 */
export const addEvent = (name, callback, element = document, useCapture) => {
  if (element.addEventListener) {
    element.addEventListener(name, callback, useCapture);
  } else if (element.attachEvent) {
    element.attachEvent(`on${name}`, callback, useCapture);
  }
};

/**
 * 删除 DOM 对象的事件监听函数
 * @param {String} name 事件名称
 * @param {*} callback 时间监听函数
 * @param {*} element 对应 DOM 元素
 * @param {*} useCapture 是否捕获方式
 */
export const removeEvent = (name, callback, element = document, useCapture) => {
  if (element.addEventListener) {
    element.removeEventListener(name, callback, useCapture);
  } else if (element.attachEvent) {
    element.detachEvent(`on${name}`, callback, useCapture);
  }
};
