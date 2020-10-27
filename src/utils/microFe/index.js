import {
  loadScripts,
  loadStyles,
  unloadResources,
  addEvent,
} from './utils';

// 项目列表，具体结构见 start 函数定义
let projects = [];
let currentActivedProject; // 记录当前激活的项目，用于项目卸载
let rootProjectHeadResources = []; // 记录项目初始化时候的 head 里 script/link 以及 style 元素
let rootProjectBodyResources = []; // 记录项目初始化时候的 body 里 script/link 以及 style 元素
const DATA_MICRO_FE_STATUS = 'data-micro-fe-status';
const WAIT_UNLOAD = 'wait-unload';

/**
 * 项目加载
 * 1. 若该项目资源已下载过，则无需重复下载，直接渲染
 * 2. 若该项目资源未下载过，则先下载入口资源，再进行渲染
 * @param {Object} singleProject 其键值同 projects 的单个对象定义
 */
const loadProject = (singleProject) => {
  const {
    appName,
    entry,
    props,
    rootNode,
    ReactDOM,
    React,
  } = singleProject;

  // 记录当前挂载的项目，用于挂载新项目时进行卸载
  if (!currentActivedProject) {
    // 如果是第一次挂载，则初始化被激活的项目为默认挂载项目
    currentActivedProject = singleProject;
  }

  const { body } = document;
  const appOld = document.getElementById(appName);
  if (appOld) {
    body.removeChild(appOld);
  }

  const script = document.createElement('script');
  script.src = entry;
  const hookAfterOnload = () => {
    // 卸载上一个项目依赖的其他资源
    unloadResources(
      (item) => (item[DATA_MICRO_FE_STATUS]
        || item.getAttribute(DATA_MICRO_FE_STATUS)) === WAIT_UNLOAD,
    );

    // 加载本项目需要的样式依赖
    loadStyles(singleProject.styles).then(() => {
      // 样式依赖无需等待
    });

    try {
      // 解决 IE8 中从高版本项目切换到低版本项目报错问题
      currentActivedProject.ReactDOM.unmountComponentAtNode(rootNode);
      if (currentActivedProject.appName !== appName) {
        // 如果不是第一次初始化项目，则清除上一个项目的全局对象
        delete window[currentActivedProject.appName];
      }
    } catch (e) {
      console.error(e);
    }

    ReactDOM.render(React.createElement(
      window[appName].default, props,
    ), rootNode);
    currentActivedProject = singleProject; // 记录当前激活的项目
  };
  script.onload = hookAfterOnload;
  script.onreadystatechange = () => {
    const r = script.readyState;
    if (r === 'loaded' || r === 'complete') {
      hookAfterOnload();
    }
  };
  body.appendChild(script);
};

/**
 * 初始化根项目依赖的资源列表，用于后续其他项目资源卸载的对比
 */
const initRootProjectResources = () => {
  const head = document.head || document.getElementsByTagName('head')[0];
  const { body } = document;
  const headScripts = head.getElementsByTagName('script');
  const headLinks = head.getElementsByTagName('link');
  const headStyles = head.getElementsByTagName('style');
  const bodyScripts = body.getElementsByTagName('script');
  const bodyLinks = body.getElementsByTagName('link');
  const bodyStyles = body.getElementsByTagName('style');
  rootProjectHeadResources = [
    ...headScripts,
    ...headLinks,
    ...headStyles,
  ];
  rootProjectBodyResources = [
    ...bodyScripts,
    ...bodyLinks,
    ...bodyStyles,
  ];
};

/**
 * 标记待卸载资源
 */
const markResourcesThatWaitUnload = () => {
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
    const isInHead = rootProjectHeadResources
      .findIndex((headItem) => headItem === currentResource) !== -1;
    if (!isInHead) {
      // eslint-disable-next-line no-param-reassign
      currentResource[DATA_MICRO_FE_STATUS] = WAIT_UNLOAD;
      try {
        currentResource.setAttribute(DATA_MICRO_FE_STATUS, WAIT_UNLOAD);
      } catch (e) {
        console.error(e);
      }
    }
  });
  nowBodyResources.forEach((currentResource) => {
    const isInBody = rootProjectBodyResources
      .findIndex((bodyItem) => bodyItem === currentResource) !== -1;
    if (!isInBody) {
      // eslint-disable-next-line no-param-reassign
      currentResource[DATA_MICRO_FE_STATUS] = WAIT_UNLOAD;
      try {
        currentResource.setAttribute(DATA_MICRO_FE_STATUS, WAIT_UNLOAD);
      } catch (e) {
        console.error(e);
      }
    }
  });
};

/**
 * 根据 activeWhen 函数激活对应项目（若该项目已激活，则直接返回）
 */
const activeRelationProjectByActiveWhen = () => {
  projects.forEach((projectItem) => {
    const {
      activeWhen,
      active,
    } = projectItem;
    if (activeWhen()) {
      if (!active) {
        // 将上个项目需要卸载的其他资源标记为待卸载状态
        markResourcesThatWaitUnload();

        // 加载本项目的依赖脚本
        loadScripts(projectItem.scripts).then(() => {
          loadProject(projectItem);
        });
        // eslint-disable-next-line no-param-reassign
        projectItem.active = true;
      }
    } else {
      // eslint-disable-next-line no-param-reassign
      projectItem.active = false;
    }
  });
};

/**
 * 配置初始化
 * @param {HTML Node} rootNode 挂载项目的默认 html 节点，比如 document.getElementById('app')
 * @param {Array} projects 项目列表，其单个值为对象，键值示例如下
 * [
 *  {
 *    // 必须，项目名称
 *    appName: 'firstProject',
 *
 *    // 必须，是否激活该项目的判断函数
 *    activeWhen: function(){
 *      return window.location.hash.indexOf('#/first-project') === 0;
 *    },
 *
 *    // 必须，项目入口文件
 *    entry: 'http://172.16.58.54:8081/firstProject.js',
 *
 *    // 必须，渲染当前项目依赖的 React 对象
 *    React: window.React,
 *
 *    // 必须 渲染当前项目依赖的 ReactDOM 对象
 *    ReactDOM: window.ReactDOM,
 *
 *    // 非必须，传递给该项目的 props ，同 React 的 props 概念
 *    props: null,
 *
 *    // 非必须，该项目要挂载的 html 节点，不传默认使用最外层的 rootNode
 *    rootNode: document.body,
 *  },
 * ]
 */
export const start = ({
  rootNode,
  projects: initProjects,
}) => {
  // 初始化全局项目配置
  projects = (initProjects || []).map((projectItem) => ({
    ...projectItem,
    // 初始化每个子项目依赖的 html 节点值
    rootNode: projectItem.rootNode || rootNode,
    active: false, // 记录该项目的激活状态，默认都是未激活
  }));

  // 初始化根项目资源列表并保存
  initRootProjectResources();

  // 监听路由切换，动态加载子项目
  addEvent('hashchange', activeRelationProjectByActiveWhen, window);

  // 根据当前路由激活初始化的项目
  activeRelationProjectByActiveWhen();
};

export default {
  start,
};
