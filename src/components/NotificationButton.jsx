import React from 'react';
import PropTypes from 'prop-types';
import { IoMdNotifications } from "react-icons/io";

const NotificationButton = ({ hasNotification }) => {
  const styles = {
    button: {
      position: 'fixed',
      top: '50px',
      right: '50px',
    },
    icon: {
      fontSize: '52px',
      color: '#191A23',
    },
    dot: {
      position: 'absolute',
      top: '6px',
      right: '8px',
      width: '15px',
      height: '15px',
      backgroundColor: '#FF715B',
      borderRadius: '50%',
    },
  };

  return (
    <div style={styles.button}>
      <IoMdNotifications style={styles.icon} />
      {hasNotification && <div style={styles.dot}></div>}
    </div>
  );
};
NotificationButton.propTypes = {
  hasNotification: PropTypes.bool.isRequired,
};

export default NotificationButton;