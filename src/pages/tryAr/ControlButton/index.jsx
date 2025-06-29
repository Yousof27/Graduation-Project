import React from 'react';
import styles from './index.module.css';

const ControlButton = (props) => {
  const { onClick, className, children } = props;

  return (
    <button
      onClick={onClick}
      className={`${styles.JeelizVTOWidgetButton} ${className}`}
    >
      {children}
    </button>
  );
};

export default ControlButton;