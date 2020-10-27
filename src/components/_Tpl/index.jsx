import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import style from './style.scss';

const Button = (props) => {
  const {
    className,
  } = props;
  return (
    <div
      className={classnames(style['c-home-button'], { [className]: !!className })}
    >
      组件基础模板
    </div>
  );
};

Button.propTypes = {
  className: PropTypes.string,
};

Button.defaultProps = {
  className: '',
};

export default Button;
