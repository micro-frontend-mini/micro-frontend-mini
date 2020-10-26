import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import style from './style.scss';

const Loading = (props) => {
  const {
    className,
  } = props;
  return (
    <i
      className={classnames('icon iconfont icon-loading', style['bend-root-config-loading'], { [className]: !!className })}
    />
  );
};

Loading.propTypes = {
  className: PropTypes.string,
};

Loading.defaultProps = {
  className: '',
};

export default Loading;
