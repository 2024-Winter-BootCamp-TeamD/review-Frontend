// src/pages/History.jsx

import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Chart from "../components/Chart/Chart";
import SearchBar from "../components/SearchBar/SearchBar";
import Reviews from "../components/Reviews/Reviews";
import {
  getPRReviewCategories,
  getPRReviews,
} from "../services/prReviewService";

// 기존 스타일 컴포넌트 유지
const HistoryContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: ${({ isDarkMode }) => (isDarkMode ? '#00000000' : '#FFFFFF')};
`;

const PageName = styled.div`
  position: absolute;
  top: -30px;
  left: 50px;
  font-size: 50px;
  font-weight: bold;
  margin: 0;
  color: ${({ isDarkMode }) => (isDarkMode ? "#FFFFFF" : "#000000")};
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
  background-color: ${({ isDarkMode }) =>
    isDarkMode ? "#00000050" : "#FFFFFFFF"};
  border: ${({ isDarkMode }) => (isDarkMode ? "1px solid #FFFFFF" : "none")};
`;

const ReviewListBox = styled.div`
  width: 100%;
  height: 48%;
  position: relative;
  padding: 10px;
  box-sizing: border-box;
  box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.25);
  border-radius: 20px;
  background-color: ${({ isDarkMode }) =>
    isDarkMode ? "#00000050" : "#FFFFFFFF"};
  overflow-y: auto;
  border: ${({ isDarkMode }) => (isDarkMode ? "1px solid #FFFFFF" : "none")};

  &::-webkit-scrollbar {
    width: 12px;
  }
  &::-webkit-scrollbar-track {
    background: ${({ isDarkMode }) => (isDarkMode ? "#4A4A4A" : "#D9D9D9")};
    border-radius: 10px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: ${({ isDarkMode }) =>
      isDarkMode ? "#FFFFFF" : "#777777"};
    border-radius: 10px;
    border: 3px solid ${({ isDarkMode }) => (isDarkMode ? "#333" : "#f0f0f0")};
  }
  &::-webkit-scrollbar-thumb:hover {
    background-color: ${({ isDarkMode }) => (isDarkMode ? "#c7c7c7" : "#555")};
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
  padding: 40px 10px 10px 10px; /* 상단 패딩 추가 */
  box-sizing: border-box;
  box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.25);
  border-radius: 20px;
  background-color: ${({ isDarkMode }) =>
    isDarkMode ? "#00000050" : "#F3F3F3"};
  border: ${({ isDarkMode }) => (isDarkMode ? "1px solid #FFFFFF" : "none")};
  overflow: hidden;
`;

const BoxTitle = styled.p`
  position: absolute;
  top: 10px; /* 상단 패딩과 일치 */
  left: 20px;
  margin: 0;
  font-size: 25px;
  font-weight: 500;
  z-index: 1000;
  color: ${({ isDarkMode }) => (isDarkMode ? "#FFFFFF" : "#000000")};
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
  opacity: ${({ selectedMode, mode }) =>
    selectedMode === "" || selectedMode === mode ? 1 : 0.3};
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
    mode === "BASIC"
      ? "#FF5722"
      : mode === "STUDY"
      ? "#FFC107"
      : mode === "NEWBIE"
      ? "#70BF73"
      : mode === "CLEAN"
      ? "#4DABF5"
      : mode === "OPTIMIZE"
      ? "#BC6FCD"
      : "#ccc"};
  cursor: pointer;
  opacity: ${({ selectedMode, mode }) =>
    selectedMode && selectedMode !== mode ? 0.3 : 1};
`;

const LegendCount = styled.div`
  font-size: 15px;
  font-weight: 500;
  color: ${({ isDarkMode }) => (isDarkMode ? '#FFFFFF' : '#000000')};
`;

// 내부 제목과 내용용 스타일 컴포넌트 추가
const DetailSection = styled.div`
  margin-bottom: 20px; /* 섹션 간 간격 */
`;

const DetailTitle = styled.div`
  font-size: 20px;
  font-weight: bold;
  text-align: left;
  margin-bottom: 5px; /* 제목과 내용 간 간격 */
  margin-top: 30px;
  margin-left: 10px;
`;

const DetailContent = styled.pre`
  margin: 0;
  padding: 0 0 10px 0; /* 내용 하단 간격 */
  text-align: left;
  color: ${({ isDarkMode }) => (isDarkMode ? "#FFFFFF" : "#000000")};
  overflow: auto;
  white-space: pre-wrap;
  font-size: 15px;
  line-height: 1.5;
  margin-left: 10px;
`;

const History = ({ isDarkMode }) => {
  const [selectedReview, setSelectedReview] = useState("");
  const [selectedMode, setSelectedMode] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statistics, setStatistics] = useState({
    basic: 0,
    study: 0,
    newbie: 0,
    clean: 0,
    optimize: 0,
  });
  const [reviews, setReviews] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  // 추가된 상태
  const [selectedProblemType, setSelectedProblemType] = useState("");
  const [selectedAverGrade, setSelectedAverGrade] = useState("");
  const [selectedReviewMode, setSelectedReviewMode] = useState("");

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const response = await getPRReviewCategories();
        setStatistics(response.statistics || {});
      } catch (error) {
        console.error("Error fetching statistics:", error);
      }
    };

    fetchStatistics();
  }, []);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const response = await getPRReviews(currentPage);

        if (response.data) {
          setReviews(response.data);
          setTotalPages(response.totalPages);
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [currentPage, selectedMode]);

  // 클릭 시 총평, 문제 유형, 등급, 모드 모두 저장
  const handleReviewClick = (review) => {
    setSelectedReview(review.total_review || "");
    setSelectedProblemType(review.problem_type || "");
    setSelectedAverGrade(review.aver_grade || "");
    setSelectedReviewMode(review.review_mode || "");
  };

  const handleSliceClick = (mode) => {
    setSelectedMode((prevMode) => (prevMode === mode ? "" : mode));
  };

  return (
    <HistoryContainer isDarkMode={isDarkMode}>
      <PageName isDarkMode={isDarkMode}>
        <p>History</p>
      </PageName>

      <ContentWrapper>
        <LeftContainer>
          <ChartBox isDarkMode={isDarkMode}>
            <BoxTitle isDarkMode={isDarkMode}>Mode Statistics</BoxTitle>
            <Chart
              onSliceClick={handleSliceClick}
              selectedMode={selectedMode}
              isDarkMode={isDarkMode}
            />
            <ChartLegend>
              {[
                { mode: "BASIC", count: statistics.basic },
                { mode: "STUDY", count: statistics.study },
                { mode: "NEWBIE", count: statistics.newbie },
                { mode: "CLEAN", count: statistics.clean },
                { mode: "OPTIMIZE", count: statistics.optimize },
              ].map(({ mode, count }) => (
                <LegendContainer
                  key={mode}
                  selectedMode={selectedMode}
                  mode={mode}
                >
                  <LegendItem mode={mode}>
                    <span>{mode}</span>
                  </LegendItem>
                  <LegendCount isDarkMode={isDarkMode}>∙∙∙∙∙∙∙∙ {count}</LegendCount>
                </LegendContainer>
              ))}
            </ChartLegend>
          </ChartBox>

          <ReviewListBox isDarkMode={isDarkMode}>
            <BoxTitle isDarkMode={isDarkMode}>All reviews</BoxTitle>
            <SearchBarContainer isDarkMode={isDarkMode}>
              <SearchBar
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                isDarkMode={isDarkMode}
              />
            </SearchBarContainer>
            <Reviews
              reviews={reviews}
              onReviewClick={handleReviewClick}
              selectedMode={selectedMode}
              searchTerm={searchTerm}
              isDarkMode={isDarkMode}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              loading={loading}
            />
          </ReviewListBox>
        </LeftContainer>

        <RightContainer>
          <ReviewDetailsBox isDarkMode={isDarkMode}>
            <BoxTitle isDarkMode={isDarkMode}>Review</BoxTitle>

            {/* 리뷰가 선택되었을 때만 아래 내용 표시 */}
            {selectedReview && (
              <>
                <DetailSection>
                  {/* 🔍 총평 */}
                  <DetailTitle>🔍 총평</DetailTitle>
                  <DetailContent isDarkMode={isDarkMode}>
                    {selectedReview}
                  </DetailContent>
                </DetailSection>

                <DetailSection>
                  {/* 🚩 주요 문제 유형 */}
                  <DetailTitle>🚩 주요 문제 유형</DetailTitle>
                  <DetailContent isDarkMode={isDarkMode}>
                    * {selectedProblemType}
                  </DetailContent>
                </DetailSection>

                <DetailSection>
                  {/* 📊 모드 및 평균 등급 */}
                  <DetailTitle>📊 모드 및 평균 등급</DetailTitle>
                  <DetailContent isDarkMode={isDarkMode}>
                    * 리뷰 모드: {selectedReviewMode}
                    {"\n"}
                    * 평균 등급: {selectedAverGrade}
                  </DetailContent>
                </DetailSection>
              </>
            )}
          </ReviewDetailsBox>
        </RightContainer>
      </ContentWrapper>
    </HistoryContainer>
  );
};

export default History;
