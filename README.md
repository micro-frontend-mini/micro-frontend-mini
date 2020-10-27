## 使用

> `micro-frontend-mini` 目前暂时支持符合以下条件的项目
> 1. `React` 项目；
> 2. 使用哈希路由；

### 安装

```
$ npm i micro-frontend-mini
```

### 使用示例

```
import { start } from 'micro-frontend-mini';


start({
  // 子项目要挂载的 DOM 节点
  rootNode: document.getElementById('app'),

  // 子项目配置列表
  projects: [
    {
      // 当前子项目的名称，需要唯一
      appName: 'template-react16',

      // 何时激活该子项目
      activeWhen() {
        return window.location.hash.indexOf('#/react16') === 0;
      },

      // 子项目的入口文件
      entry: `//localhost:8091/template-react16.js`,

      // 传递给子项目的数据，同 React 的 props
      props: { hello: 'hi React16' },

      // 子项目依赖的 ReactDOM 对象
      ReactDOM: window.ReactDOMV16,

      // 子项目依赖的 React 对象
      React: window.ReactV16,

      // 子项目依赖的前置脚本
      scripts: [
        `//localhost:8091/template-react16-dll.vendor.js`,
      ],

      // 子项目依赖的前置样式
      styles: [
        '//web.ewt360.com/common/antd/dev/4.4.2/antd.css',
      ],
    },
  ],
});
```
**配置解释**
1. 框架对外暴露一个 `start` 函数，接受2个顶级参数。`rootNode` 子项目要挂载的 DOM 节点；`projects` 子项目配置列表。
2. 其中 `projects` 是一个数组，每个数组元素就是一个项目的配置对象。

针对每个项目的配置参数，以下是具体说明表：

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>说明</th>
      <th>类型</th>
      <th>是否必须</th>
      <th>默认值</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>appName</td>
      <td>子项目名称，不能和其他项目重名</td>
      <td>string</td>
      <td>是</td>
      <td>无</td>
    </tr>
    <tr>
      <td>activeWhen</td>
      <td>何时激活该项目的回调函数，返回 true 时激活该项目，否则不激活</td>
      <td>func</td>
      <td>是</td>
      <td>无</td>
    </tr>
    <tr>
      <td>entry</td>
      <td>子项目的入口文件地址</td>
      <td>string</td>
      <td>是</td>
      <td>无</td>
    </tr>
    <tr>
      <td>props</td>
      <td>传递给子项目的数据，同 React 的 props</td>
      <td>any</td>
      <td>是</td>
      <td>无</td>
    </tr>
    <tr>
      <td>ReactDOM</td>
      <td>子项目依赖的 ReactDOM 对象（可以在 HTML 文件中全局引入）</td>
      <td>object</td>
      <td>是</td>
      <td>无</td>
    </tr>
    <tr>
      <td>React</td>
      <td>子项目依赖的 React 对象（可以在 HTML 文件中全局引入）</td>
      <td>object</td>
      <td>是</td>
      <td>无</td>
    </tr>
    <tr>
      <td>scripts</td>
      <td>子项目依赖的前置脚本（比如 dll 文件等）</td>
      <td>array</td>
      <td>否</td>
      <td>[]</td>
    </tr>
    <tr>
      <td>styles</td>
      <td>子项目依赖的前置样式</td>
      <td>array</td>
      <td>否</td>
      <td>[]</td>
    </tr>
  </tbody>
</table>

## 完整示例

基于 `micro-fontend-mini` 微前端框架的示例项目已同步上传至 github，具体有以下3个仓库作为示例代码：
1. [root-config](https://github.com/micro-frontend-mini/root-config) 示例主项目（微前端框架所在的项目）；
2. [tempalte-react16](https://github.com/micro-frontend-mini/template-react16) 基于 React16 & webpack4 的示例子项目；
3. [template-react14](https://github.com/micro-frontend-mini/template-react14) 基于 React14 & webpack1 且兼容IE8的示例子项目；

**如何运行**
1. 克隆以上3个项目到本地，并且在各自仓库下执行 `npm i` 安装好依赖；
2. 子项目（`tempalte-react16` 和 `template-react14`）执行 `npm start` 启动即可；
3. 主项目，Mac 执行 `sudo npm start`，Windows 以管理员权限运行命令行工具并执行 `npm start` 即可；
4. 访问 `http://localhost` 查看最终效果，如下图所示：

![](http://www.iseeit.cn/wp-content/uploads/2020/10/WechatIMG7480.jpeg)

上图中有4个路由，对应属于2个子项目，切换路由的时候，查看控制台的网络请求，可以看到详细的资源加载情况。

> `micro-frontend-mini` 目前是 1.x 版本，后续关于常见框架（比如 `Vue`）会陆续迭代支持；并且会考虑支持自定义项目挂载和卸载，这样就可以方便任何类型的子项目接入。
