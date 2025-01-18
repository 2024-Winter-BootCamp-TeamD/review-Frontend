import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { IoMdNotifications } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import styled, { keyframes } from 'styled-components';

const ButtonContainer = styled.div`
  position: fixed;
  top: 25px;
  right: 29px;
`;

const NotificationIcon = styled(IoMdNotifications)`
  font-size: 40px;
  color: #191A23;
`;

const sonarAnimation = keyframes`
  0% { transform: scale(.9); opacity: 1; }
  100% { transform: scale(2); opacity: 0; }
`;

const pulseAnimation = keyframes`
  0% { transform: scale(1); }
  20% { transform: scale(1.4); }
  50% { transform: scale(.9); }
  80% { transform: scale(1.2); }
  100% { transform: scale(1); }
`;

const NotificationDot = styled.div`
  position: absolute;
  top: -3px;
  right: -6px;
  width: 1.5rem;
  height: 1.5rem;
  background-color: #ff0000;
  border-radius: 50%;
  border: 0.2rem solid #fff;
  box-shadow: 1px 1px 5px rgba(0,0,0, .2);
  box-sizing: border-box;
  color: #fff;
  font-weight: bold;
  font-size: 1rem;
  line-height: 1.55;
  text-align: center;
  animation: ${pulseAnimation} 1.5s 1;

  &::after {
    content: '';
    position: absolute;
    top: -0.1rem;
    left: -0.1rem;
    border: 2px solid rgba(255,0,0,.5);
    opacity: 0;
    border-radius: 50%;
    width: 100%;
    height: 100%;
    animation: ${sonarAnimation} 1.5s 1;
  }
`;

const NotificationDropdown = styled.div`
  position: absolute;
  top: 60px;
  right: 0;
  width: 370px;
  max-height: 300px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  overflow-y: auto;
  z-index: 2000;
  padding: 10px;
  
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 4px;
  }
`;

const NotificationItem = styled.div`
  display: flex;
  align-items: center;
  padding: 12px;
  border-bottom: 1px solid #eee;
  
  &:last-child {
    border-bottom: none;
  }
`;

const ProfileImage = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 12px;
`;

const MessageContent = styled.div`
  flex: 1;
  font-size: 15px;
  
  strong {
    font-weight: 600;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  padding: 5px;
  margin-right: -8px;
  &:hover {
    color: #ff0000;
  }
`;

const NotificationButton = ({ hasNotification, notificationCount = 1 }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      avatar: "https://avatars.githubusercontent.com/u/1",
      name: "John Doe",
      message: "requested your review on pull request",
    },
    {
      id: 2,
      avatar: "https://avatars.githubusercontent.com/u/2",
      name: "Jane Smith",
      message: "requested your review on pull request",
    },
    {
      id: 3,
      avatar: "https://avatars.githubusercontent.com/u/3",
      name: "Mike Johnson",
      message: "requested your review on pull request",
    },
    {
      id: 4,
      avatar: "https://avatars.githubusercontent.com/u/4",
      name: "Sarah Wilson",
      message: "requested your review on pull request",
    },
  ]);

  const handleNotificationClick = () => {
    setIsOpen(!isOpen);
  };

  const removeNotification = (id) => {
    setNotifications(notifications.filter(notif => notif.id !== id));
  };

  return (
    <ButtonContainer>
      <NotificationIcon onClick={handleNotificationClick} />
      {hasNotification && <NotificationDot>{notificationCount}</NotificationDot>}
      {isOpen && (
        <NotificationDropdown>
          {notifications.map((notification) => (
            <NotificationItem key={notification.id}>
              <ProfileImage src={notification.avatar} alt={`${notification.name}'s avatar`} />
              <MessageContent>
                <strong>{notification.name}</strong> {notification.message}
              </MessageContent>
              <CloseButton onClick={() => removeNotification(notification.id)}>
                <IoClose size={20} />
              </CloseButton>
            </NotificationItem>
          ))}
        </NotificationDropdown>
      )}
    </ButtonContainer>
  );
};

NotificationButton.propTypes = {
  hasNotification: PropTypes.bool.isRequired,
  notificationCount: PropTypes.number,
};

export default NotificationButton;