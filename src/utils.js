/**
 * 加载 javascript 脚本
 * @param {Array} scripts 需要加载的脚本链接数组
 * @example ['//localhost/a.js', '//www.abc.com/b.js']
 * @return {Promise}
 */
export const loadScripts = (scripts = []) => {
  if (scripts.length === 0) {
    return Promise.resolve();
  }
  const scriptsPromises = scripts.map((srciptSrc) => new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = srciptSrc;
    script.onload = () => {
      resolve();
    };
    // 兼容IE8 的 onload 处理
    try {
      script.onreadystatechange = () => {
        const r = script.readyState;
        if (r === 'loaded' || r === 'complete') {
          resolve();
        }
      };
    } catch (e) {
      console.error(e);
    }
    document.body.appendChild(script);
  }));
  return Promise.all(scriptsPromises);
};

/**
 * 加载 link 样式依赖
 * @param {Array} styles 需要加载的脚本链接数组
 * @return {Promise}
 */
export const loadStyles = (styles = []) => {
  if (styles.length === 0) {
    return Promise.resolve();
  }
  // 注意这里以来的样式是前置样式，需要加载到 head 标签里
  // 如果加载到 body 标签，则可能导致项目内部的全局样式重置失效
  const head = document.head || document.getElementsByTagName('head')[0];
  const headFirstValidStyleNode = head.getElementsByTagName('style')[0]
    || head.getElementsByTagName('link')[0];
  let styleSorted = styles;
  if (headFirstValidStyleNode) {
    // 如果 head 标签中有样式资源，则将将要加载的样式资源数组顺序反转
    // 并一一插入 head 头部（顺序反转是为了保证最终加载顺序和原始顺序一致）
    styleSorted = styleSorted.reverse();
  }
  const linkPromises = styleSorted.map((linkSrc) => new Promise((resolve) => {
    const link = document.createElement('link');
    link.href = linkSrc;
    link.rel = 'stylesheet';
    link.onload = () => {
      resolve();
    };
    if (headFirstValidStyleNode) {
      // 如果 head 标签中已有样式资源
      // 则按照反转后的顺序依次插入 head 标签
      head.insertBefore(link, headFirstValidStyleNode);
    } else {
      head.appendChild(link);
    }
  }));
  return Promise.all(linkPromises);
};

/**
 * 卸载 condition 为 true 的资源
 * @param {Function} condition 条件函数，其参数为当前元素对应的 dom 对象
 * @example unloadResources((item) => item.id === 'a');
 */
export const unloadResources = (condition) => {
  const head = document.head || document.getElementsByTagName('head')[0];
  const { body } = document;
  const headScripts = head.getElementsByTagName('script');
  const headLinks = head.getElementsByTagName('link');
  const headStyles = head.getElementsByTagName('style');
  const bodyScripts = body.getElementsByTagName('script');
  const bodyLinks = body.getElementsByTagName('link');
  const bodyStyles = body.getElementsByTagName('style');
  const nowHeadResources = [
    ...headScripts,
    ...headLinks,
    ...headStyles,
  ];
  const nowBodyResources = [
    ...bodyScripts,
    ...bodyLinks,
    ...bodyStyles,
  ];
  nowHeadResources.forEach((currentResource) => {
    if (condition(currentResource)) {
      head.removeChild(currentResource);
    }
  });
  nowBodyResources.forEach((currentResource) => {
    if (condition(currentResource)) {
      body.removeChild(currentResource);
    }
  });
};

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

export default {
  loadScripts,
  loadStyles,
  addEvent,
};
