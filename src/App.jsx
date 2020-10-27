import React from 'react';
import ReactDOM from 'react-dom';
import { start } from 'micro-frontend-mini';
import projectsDev from '~/config/projects.dev';
import projectsProd from '~/config/projects.prod';
import Menu from '~/components/Menu';
// eslint-disable-next-line import/named
import '~/assets/styles/reset.scss';
import style from './style.scss';

const isDev = process.env.NODE_ENV !== 'production';
const projects = isDev ? projectsDev : projectsProd;
const navMenu = [
  {
    title: 'react16根路由',
    url: '/react16/home',
  },
  {
    title: 'react16-hello路由',
    url: '/react16/hello',
  },
  {
    title: 'react14根路由',
    url: '/react14/home',
  },
  {
    title: 'react14-hello路由',
    url: '/react14/hello',
  },
];

class App extends React.Component {
  componentDidMount() {
    start({
      rootNode: this.rootNode,
      // 基础数据从根项目以 props 的方式传递给子项目
      projects: projects.map((item) => ({ ...item })),
    });
  }

  render() {
    return (
      <div className={style['micro-fe-root-config']}>
        <Menu data={navMenu} />
        <div id="root-config-app" ref={(r) => { this.rootNode = r; }} className={style['micro-app']} />
      </div>
    );
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('app'),
);

if (module.hot) {
  module.hot.accept();
}
