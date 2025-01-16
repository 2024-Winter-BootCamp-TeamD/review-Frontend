import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Chart from '../components/Chart/Chart';
import SearchBar from '../components/SearchBar/SearchBar';
import Reviews from '../components/Reviews/Reviews';

const HistoryContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: ${({ isDarkMode }) => (isDarkMode ? '#00000000' : '#FFFFFF00')};
`;

const PageName = styled.div`
  position: absolute;
  top: -10px;
  left: 50px;
  font-size: 40px;
  margin: 0;
  color: ${({ isDarkMode }) => (isDarkMode ? '#FFFFFF' : '#000000')};
`;

const ContentWrapper = styled.div`
  display: flex;
  height: calc(100% - 80px);
  margin-top: 80px;
  padding: 20px;
  box-sizing: border-box;
  overflow: hidden;
`;

const LeftContainer = styled.div`
  width: 60%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  box-sizing: border-box;
  overflow: hidden;
`;

const ChartBox = styled.div`
  width: 100%;
  height: 50%;
  position: relative;
  padding: 10px;
  box-sizing: border-box;
  box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.25);
  border-radius: 20px;
  background-color: ${({ isDarkMode }) => (isDarkMode ? '#00000050' : '#F3F3F3')};
  border: ${({ isDarkMode }) => (isDarkMode ? '1px solid #FFFFFF' : 'none')};
`;

const ReviewListBox = styled.div`
  width: 100%;
  height: 48%;
  position: relative;
  padding: 10px;
  box-sizing: border-box;
  box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.25);
  border-radius: 20px;
  background-color: ${({ isDarkMode }) => (isDarkMode ? '#00000050' : '#F3F3F3')};
  overflow-y: auto;
  border: ${({ isDarkMode }) => (isDarkMode ? '1px solid #FFFFFF' : 'none')};

  &::-webkit-scrollbar {
    width: 12px;
  }
  &::-webkit-scrollbar-track {
    background: ${({ isDarkMode }) => (isDarkMode ? '#4A4A4A' : '#D9D9D9')};
    border-radius: 10px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: ${({ isDarkMode }) => (isDarkMode ? '#FFFFFF' : '#777777')};
    border-radius: 10px;
    border: 3px solid ${({ isDarkMode }) => (isDarkMode ? '#333' : '#f0f0f0')};
  }
  &::-webkit-scrollbar-thumb:hover {
    background-color: ${({ isDarkMode }) => (isDarkMode ? '#c7c7c7' : '#555')};
  }
`;

const SearchBarContainer = styled.div`
  margin-top: 7px;
  margin-left: 385px;
  margin-bottom: -7px;
`;

const RightContainer = styled.div`
  width: 40%;
  height: 98%;
  padding: 10px;
  box-sizing: border-box;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  margin-top: 10px;
`;

const ReviewDetailsBox = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  padding: 10px;
  box-sizing: border-box;
  box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.25);
  border-radius: 20px;
  background-color: ${({ isDarkMode }) => (isDarkMode ? '#00000050' : '#F3F3F3')};
  border: ${({ isDarkMode }) => (isDarkMode ? '1px solid #FFFFFF' : 'none')};
  overflow: hidden;

  pre {
    margin-top: 70px;
    padding: 20px;
    text-align: left;
    color: ${({ isDarkMode }) => (isDarkMode ? '#FFFFFF' : '#000000')};
  }
`;

const BoxTitle = styled.p`
  position: absolute;
  top: 20px;
  left: 20px;
  margin: 0;
  font-size: 25px;
  font-weight: bold;
  z-index: 1000;
  color: ${({ isDarkMode }) => (isDarkMode ? '#FFFFFF' : '#000000')};
`;

const ChartLegend = styled.div`
  position: absolute;
  top: 120px;
  right: 110px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const LegendContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  opacity: ${({ selectedMode, mode }) => (selectedMode === '' || selectedMode === mode ? 1 : 0.3)};
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100px;
  height: 32px;
  border-radius: 20px;
  padding: 5px;
  box-sizing: border-box;
  font-size: 15px;
  color: #fff;
  text-align: center;
  background-color: ${({ mode }) =>
    mode === 'BASIC' ? '#FF5722' :
    mode === 'CLEAN' ? '#BC6FCD' :
    mode === 'OPTIMIZE' ? '#4CAF50' :
    mode === 'NEWBIE' ? '#2196F3' :
    mode === 'STUDY' ? '#FFC107' :
    '#ccc'};
`;

const LegendCount = styled.div`
  font-size: 15px;
  font-weight: bold;
  color: ${({ isDarkMode }) => (isDarkMode ? '#FFFFFF' : '#000000')};
`;

const History = ({ isDarkMode }) => {
  const [selectedReview, setSelectedReview] = useState('');
  const [selectedMode, setSelectedMode] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const handleReviewClick = (content) => {
    setSelectedReview(content);
  };

  const handleSliceClick = (mode) => {
    setSelectedMode((prevMode) => (prevMode === mode ? '' : mode));
  };

  useEffect(() => {
    window.dispatchEvent(new Event('resize'));
  }, []);

  return (
    <HistoryContainer isDarkMode={isDarkMode}>
      <PageName isDarkMode={isDarkMode}>
        <p>History</p>
      </PageName>

      <ContentWrapper>
        <LeftContainer>
          <ChartBox isDarkMode={isDarkMode}>
            <BoxTitle isDarkMode={isDarkMode}>Mode Statistics</BoxTitle>
            <Chart onSliceClick={handleSliceClick} selectedMode={selectedMode} />
            <ChartLegend>
              {['BASIC', 'CLEAN', 'OPTIMIZE', 'NEWBIE', 'STUDY'].map((mode) => (
                <LegendContainer key={mode} selectedMode={selectedMode} mode={mode}>
                  <LegendItem mode={mode}>
                    <span>{mode}</span>
                  </LegendItem>
                  <LegendCount isDarkMode={isDarkMode}>……………… 12</LegendCount>
                </LegendContainer>
              ))}
            </ChartLegend>
          </ChartBox>

          <ReviewListBox isDarkMode={isDarkMode}>
            <BoxTitle isDarkMode={isDarkMode}>All reviews</BoxTitle>
            <SearchBarContainer isDarkMode={isDarkMode}>
              <SearchBar value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} isDarkMode={isDarkMode} />
            </SearchBarContainer>
            <Reviews onReviewClick={handleReviewClick} selectedMode={selectedMode} searchTerm={searchTerm} isDarkMode={isDarkMode} />
          </ReviewListBox>
        </LeftContainer>

        <RightContainer>
          <ReviewDetailsBox isDarkMode={isDarkMode}>
            <BoxTitle isDarkMode={isDarkMode}>Review</BoxTitle>
            <pre>{selectedReview}</pre>
          </ReviewDetailsBox>
        </RightContainer>
      </ContentWrapper>
    </HistoryContainer>
  );
};

export default History;