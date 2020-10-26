const { HASH_SUFFIX } = process.env;

/**
 * 开发环境：微前端项目配置列表
 */
export default [
  {
    appName: 'template-react16',
    activeWhen() {
      return window.location.hash.indexOf('#/react16') === 0;
    },
    entry: `//localhost:8091/template-react16.js?t=${HASH_SUFFIX}`,
    props: { hello: 'hi React16' },
    ReactDOM: window.ReactDOMV16,
    React: window.ReactV16,
    scripts: [
      `//localhost:8091/template-react16-dll.vendor.js?t=${HASH_SUFFIX}`,
    ], // 本项目依赖的需要重新加载的脚本
    styles: [
      '//web.ewt360.com/common/antd/dev/4.4.2/antd.css',
    ], // 本项目依赖的需要重新加载的样式
  },
  {
    appName: 'template-react14',
    activeWhen() {
      return window.location.hash.indexOf('#/react14') === 0;
    },
    entry: `//localhost:8092/template-react14.js?t=${HASH_SUFFIX}`,
    props: { hello: 'hi React14' },
    ReactDOM: window.ReactDOM,
    React: window.React,
    scripts: [
      `//localhost:8092/template-react14-dll.vendor.js?t=${HASH_SUFFIX}`,
      '//web.ewt360.com/common/react-router/dev/2.3.0/react-router.js',
    ], // 本项目依赖的需要重新加载的脚本
    styles: [
      '//web.ewt360.com/common/antd/dev/1.11.6/antd.css',
    ], // 本项目依赖的需要重新加载的样式
  },
];
