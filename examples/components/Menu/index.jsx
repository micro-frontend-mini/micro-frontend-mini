import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import style from './style.scss';

const Menu = (props) => {
  const {
    className,
    data,
    subMenuAlignDirection,
  } = props;
  const isSubMenuAlignRight = subMenuAlignDirection === 'right';
  const subMenuStyle = {
    left: 0,
  };
  if (isSubMenuAlignRight) {
    delete subMenuStyle.left;
    subMenuStyle.right = 0;
    subMenuStyle.textAlign = 'right';
  }
  return (
    <ul
      className={classnames(style.menu, { [className]: !!className })}
    >
      {
        data.map(({
          title,
          url,
          target,
          render,
          children,
        }) => {
          let menuItemNode = (
            <span className={style.title}>
              {title}
              { children && children.length ? <i className="icon iconfont icon-triangle-down" /> : null }
            </span>
          );
          let submenusNode = null;
          const isParentHashRoute = true;
          if (url) {
            menuItemNode = (<a href={`${isParentHashRoute ? '#' : ''}${url}`} target={target || '_self'}>{menuItemNode}</a>);
          }
          if (render) {
            menuItemNode = render({ title, url, target });
          }
          if (children && children.length) {
            submenusNode = (
              <ul
                style={subMenuStyle}
                className={classnames(`animate__animated animate__fadeIn ${style['sub-menu']}`)}
              >
                {
                  children.map(({
                    title: childTitle,
                    url: childUrl,
                    target: childTarget,
                    render: childRender,
                    routetype: childRouteType,
                  }) => {
                    let subMenuItemNode = childTitle;
                    const isChildHashRoute = Number(childRouteType) === 2; // 历史遗留数据定义
                    if (childUrl) {
                      subMenuItemNode = (<a href={`${isChildHashRoute ? '#' : ''}${childUrl}`} target={childTarget || '_self'}>{childTitle}</a>);
                    }
                    if (childRender) {
                      subMenuItemNode = childRender({
                        title: childTitle,
                        url: childUrl,
                        target: childTarget,
                      });
                    }
                    return (
                      <li className={style['sub-menu-item']} key={childTitle}>{subMenuItemNode}</li>
                    );
                  })
                }
              </ul>
            );
          }
          return (
            <li className={style['menu-item']} key={title}>
              {menuItemNode}
              {submenusNode}
            </li>
          );
        })
      }
    </ul>
  );
};

Menu.propTypes = {
  className: PropTypes.string,
  subMenuAlignDirection: PropTypes.oneOf(['left', 'right']), // 菜单对齐的方向
  // 暂时支持2级菜单渲染，children 结构同父对象
  data: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string,
    url: PropTypes.string,
    target: PropTypes.string,
    render: PropTypes.func,
    children: PropTypes.arrayOf(PropTypes.shape({
      title: PropTypes.string,
      url: PropTypes.string,
      target: PropTypes.string,
      render: PropTypes.func,
    })),
  })),
};

Menu.defaultProps = {
  className: '',
  subMenuAlignDirection: 'left',
  data: [],
};

export default Menu;
