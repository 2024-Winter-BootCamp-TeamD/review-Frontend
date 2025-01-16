import React from 'react';
import PropTypes from 'prop-types';
import { IoMdNotifications } from "react-icons/io";
import styled from 'styled-components';

const ButtonContainer = styled.div`
  position: fixed;
  top: 15px;
  right: 21px;
`;

const NotificationIcon = styled(IoMdNotifications)`
  font-size: 40px;
  color: #191A23;
`;

const NotificationDot = styled.div`
  position: absolute;
  top: 6px;
  right: 8px;
  width: 15px;
  height: 15px;
  background-color: #FF715B;
  border-radius: 50%;
`;

const NotificationButton = ({ hasNotification }) => {
  return (
    <ButtonContainer>
      <NotificationIcon />
      {hasNotification && <NotificationDot />}
    </ButtonContainer>
  );
};

NotificationButton.propTypes = {
  hasNotification: PropTypes.bool.isRequired,
};

export default NotificationButton;