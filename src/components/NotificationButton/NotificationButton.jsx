import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { IoMdNotifications } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import styled from "styled-components";
import Cat from "../../assets/SleepingCat.svg";
import { fetchUserInfo, getAllRepositories } from "../../services/repositoryService";

const ButtonContainer = styled.div`
  position: fixed;
  top: 25px;
  right: 29px;
`;

const NotificationIcon = styled(IoMdNotifications)`
  font-size: 40px;
  color: ${({ isDarkMode }) => (isDarkMode ? "#D6D6D6" : "#191A23")};
  transition: color 0.3s ease;
  cursor: pointer;
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
  box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.2);
  box-sizing: border-box;
  color: #fff;
  font-weight: bold;
  font-size: ${({ notificationCount }) => (notificationCount < 10 ? "1rem" : "0.6rem")};
  line-height: ${({ notificationCount }) => (notificationCount < 10 ? "1.2" : "1.7")};
  text-align: center;
`;

const NotificationDropdown = styled.div`
  position: absolute;
  top: 60px;
  right: 0;
  width: 370px;
  max-height: 300px;
  background-color: ${({ isDarkMode }) => (isDarkMode ? "#191A23" : "#FFFFFF")};
  color: ${({ isDarkMode }) => (isDarkMode ? "#FFFFFF" : "#191A23")};
  border: 1px solid ${({ isDarkMode }) => (isDarkMode ? "#FFFFFF" : "#191A23")};
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  overflow-y: auto;
  z-index: 2000;
  padding: 10px;

  &::-webkit-scrollbar {
    width: 12px;
  }
  &::-webkit-scrollbar-track {
    background: ${({ isDarkMode }) => (isDarkMode ? "#4A4A4A" : "#D9D9D9")};
    border-radius: 10px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: ${({ isDarkMode }) => (isDarkMode ? "#FFFFFF" : "#777777")};
    border-radius: 10px;
    border: 3px solid ${({ isDarkMode }) => (isDarkMode ? "#333" : "#f0f0f0")};
  }
  &::-webkit-scrollbar-thumb:hover {
    background-color: ${({ isDarkMode }) => (isDarkMode ? "#c7c7c7" : "#555")};
  }
`;

const NotificationItem = styled.div`
  display: flex;
  align-items: center;
  padding: 12px;
  border-bottom: 1px solid #eee;
  cursor: pointer;

  &:hover {
    background-color: ${({ isDarkMode }) => (isDarkMode ? "#333" : "#f5f5f5")};
  }

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
  transition: color 0.3s ease, transform 0.3s ease;
  &:hover {
    color: #ff0000;
    transform: scale(1.1);
  }
`;

const NotificationButton = ({ hasNotification, isDarkMode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchPullRequests = async () => {
      try {
        const userInfo = await fetchUserInfo();
        const repositories = await getAllRepositories();

        const allNotifications = await Promise.all(
          repositories.map(async (repo) => {
            const response = await fetch(
              `https://api.github.com/repos/${repo.organization}/${repo.name}/pulls`
            );

            if (!response.ok) {
              console.error(
                `Failed to fetch pull requests for ${repo.name}:`,
                response.statusText
              );
              return [];
            }

            const pullRequests = await response.json();
            return pullRequests.map((pr) => ({
              id: pr.id,
              avatar: pr.user.avatar_url,
              name: pr.user.login,
              message: `requested your Review on Pull Request`,
              url: pr.html_url,
              createdAt: pr.created_at, // PR 요청 시간을 가져옴
            }));
          })
        );

        // 최신 알림 순으로 정렬
        const sortedNotifications = allNotifications
          .flat()
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // createdAt 기준으로 최신순 정렬

        setNotifications(sortedNotifications);
      } catch (error) {
        console.error("Error fetching pull requests:", error.message);
      }
    };

    fetchPullRequests();
  }, []);

  const handleNotificationClick = () => {
    setIsOpen(!isOpen);
  };

  const removeNotification = (id) => {
    setNotifications(notifications.filter((notif) => notif.id !== id));
  };

  return (
    <ButtonContainer>
      <NotificationIcon isDarkMode={isDarkMode} onClick={handleNotificationClick} />
      {hasNotification && notifications.length > 0 && (
        <NotificationDot notificationCount={notifications.length}>
          {notifications.length >= 100 ? "99+" : notifications.length}
        </NotificationDot>
      )}
      {isOpen && (
        <NotificationDropdown isDarkMode={isDarkMode}>
          {notifications.length === 0 ? (
            <div
              style={{
                padding: "20px",
                textAlign: "center",
                color: isDarkMode ? "#FFFFFF" : "#000000",
              }}
            >
              <img src={Cat} alt="Sleeping Cat" style={{ width: "200px", height: "200px" }} />
              <div style={{ fontSize: "20px", fontWeight: "bold" }}>알림이 없습니다</div>
            </div>
          ) : (
            notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                isDarkMode={isDarkMode}
                onClick={() => window.open(notification.url, "_blank")}
              >
                <ProfileImage src={notification.avatar} alt={`${notification.name}'s avatar`} />
                <MessageContent>
                  <strong>{notification.name}</strong> {notification.message}
                </MessageContent>
                <CloseButton onClick={(e) => {
                  e.stopPropagation();
                  removeNotification(notification.id);
                }}>
                  <IoClose size={20} />
                </CloseButton>
              </NotificationItem>
            ))
          )}
        </NotificationDropdown>
      )}
    </ButtonContainer>
  );
};

NotificationButton.propTypes = {
  hasNotification: PropTypes.bool.isRequired,
  isDarkMode: PropTypes.bool.isRequired,
};

export default NotificationButton;
