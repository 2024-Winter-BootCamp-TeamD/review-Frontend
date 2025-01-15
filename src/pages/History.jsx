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
`;

const PageName = styled.div`
  position: absolute;
  top: -10px;
  left: 50px;
  font-size: 40px;
  margin: 0;
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

  .chart-inner {
    width: 97%;
    height: 97%;
    margin-left: -120px;
    margin-top: 2px;
  }
`;

const ReviewListBox = styled.div`
  width: 100%;
  height: 48%;
  position: relative;
  padding: 10px;
  box-sizing: border-box;
  box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.25);
  border-radius: 20px;
  overflow: hidden;
`;

const SearchBarContainer = styled.div`
  margin-top: 5px;
  margin-left: 335px;
  margin-bottom: -5px;
`;

const RightContainer = styled.div`
  width: 40%;
  height: 100%;
  padding: 10px;
  box-sizing: border-box;
  display: flex;
  align-items: flex-start;
  justify-content: center;
`;

const ReviewDetailsBox = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  padding: 10px;
  box-sizing: border-box;
  box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.25);
  border-radius: 20px;
  background-color: #F3F3F3;
  overflow: hidden;

  pre {
    margin-top: 70px;  // Review 제목과의 간격 조정
    padding: 20px;     // 내용의 여백 추가
    text-align: left;
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
    mode === 'CLEAN' ? '#9E9E9E' :
    mode === 'OPTIMIZE' ? '#4CAF50' :
    mode === 'NEWBIE' ? '#2196F3' :
    mode === 'STUDY' ? '#FFC107' :
    '#ccc'};
`;

const LegendCount = styled.div`
  font-size: 15px;
  font-weight: bold;
  color: #000;
`;

const History = () => {
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
    <HistoryContainer>
      <PageName>
        <p>History</p>
      </PageName>

      <ContentWrapper>
        <LeftContainer>
          <ChartBox>
            <BoxTitle>Mode Statistics</BoxTitle>
            <Chart onSliceClick={handleSliceClick} selectedMode={selectedMode} />
            <ChartLegend>
              {['BASIC', 'CLEAN', 'OPTIMIZE', 'NEWBIE', 'STUDY'].map((mode) => (
                <LegendContainer key={mode} selectedMode={selectedMode} mode={mode}>
                  <LegendItem mode={mode}>
                    <span>{mode}</span>
                  </LegendItem>
                  <LegendCount>……………… 12</LegendCount>
                </LegendContainer>
              ))}
            </ChartLegend>
          </ChartBox>

          <ReviewListBox>
            <BoxTitle>All reviews</BoxTitle>
            <SearchBarContainer>
              <SearchBar value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </SearchBarContainer>
            <Reviews onReviewClick={handleReviewClick} selectedMode={selectedMode} searchTerm={searchTerm} />
          </ReviewListBox>
        </LeftContainer>

        <RightContainer>
          <ReviewDetailsBox>
            <BoxTitle>Review</BoxTitle>
            <pre>{selectedReview}</pre>
          </ReviewDetailsBox>
        </RightContainer>
      </ContentWrapper>
    </HistoryContainer>
  );
};

export default History;
