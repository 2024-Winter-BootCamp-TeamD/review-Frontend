import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import LoadingIndicator from '../components/LoadingIndicator/LoadingIndicator';

const HomeContainer = styled.div`
  position: relative;
  width: calc(100% - 300px); // 사이드바 너비(300px)를 제외한 너비
  height: 100vh;
  margin-left: 300px; // 사이드바 너비만큼 여백 추가
`;

const ContentContainer = styled.div`
  padding: 20px;
`;

const Home = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 200000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <HomeContainer>
      {isLoading ? (
        <LoadingIndicator />
      ) : (
        <ContentContainer>
          <h2>Home Page</h2>
          <p>This is the Home page content.</p>
        </ContentContainer>
      )}
    </HomeContainer>
  );
};

export default Home;
