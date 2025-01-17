import React, { useState } from 'react';
import styled from 'styled-components';

const ReviewsContainer = styled.div`
  width: 850px;
  max-height: 79%;
  overflow-y: auto;
  overflow-x: hidden;
  margin-top: 40px;
  margin-left: 8px;
  background-color: ${({ isDarkMode }) => (isDarkMode ? '#00000000' : '#FFFFFF00')};

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

const ReviewItem = styled.div`
  display: flex;
  flex-direction: column;
  width: 830px;
  min-height: 57px;
  border: 1px solid #ccc;
  border-radius: 15px;
  padding: 5px 10px;
  margin-bottom: 10px;
  box-sizing: border-box;
  background-color: ${({ isSelected, isDarkMode }) => 
    isSelected ? (isDarkMode ? '#333333' : '#D9D9D9') : (isDarkMode ? '#00000050' : '#FFFFFF')};
  font-size: 15px;
  box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.25);
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  transform: ${({ isSelected }) => isSelected ? 'translateX(5px)' : 'none'};

  &:hover {
    transform: translateX(5px);
    background-color: ${({ isSelected, isDarkMode }) => 
      isSelected ? (isDarkMode ? '#333333' : '#D9D9D9') : (isDarkMode ? '#333333' : '#D9D9D9')};
  }
`;

const ReviewSummary = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  margin-top: 12px;
`;

const ReviewMode = styled.div`
  flex: 1;
  font-weight: bold;
  text-align: left;
  margin-left: 40px;
  color: ${props => {
    switch (props.mode) {
      case 'CLEAN': return '#4DABF5';
      case 'OPTIMIZE': return '#BC6FCD';
      case 'NEWBIE': return '#70BF73';
      case 'STUDY': return '#FFC107';
      case 'BASIC': return '#FF5722';
      default: return isDarkMode ? '#FFFFFF' : '#333';
    }
  }};
`;

const ReviewLink = styled.div`
  flex: 1.5;
  margin-left: -180px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: left;
  color: ${({ isDarkMode }) => (isDarkMode ? '#FFFFFF' : '#000000')};
`;

const ReviewDate = styled.div`
  margin-right: 35px;
  color: ${({ isDarkMode }) => (isDarkMode ? '#FFFFFF' : '#000000')};
`;

const ReviewArrow = styled.div`
  margin-right: 20px;
  font-size: 18px;
  color: ${({ isDarkMode }) => (isDarkMode ? '#FFFFFF' : '#000000')};
`;

//더미데이터
const dummyReviews = [
  { 
    id: 1, 
    mode: 'CLEAN', 
    link: "[feat/#3] 알림 버튼 구현", 
    date: '2023.01.01', 
    content: "코드 가독성이 우수하며, 함수 이름이 직관적입니다." 
  },
  { 
    id: 2, 
    mode: 'OPTIMIZE', 
    link: "[feat/#6] 서치 바 제작", 
    date: '2023.01.02', 
    content: "비동기 처리 부분이 잘 구현되었으나, 몇몇 매직 넘버에 개선 여지가 있습니다." 
  },
  { 
    id: 3, 
    mode: 'NEWBIE', 
    link: "[feat/#7] 서치 바(Alternative Version) 제작 ", 
    date: '2023.01.03', 
    content: "초보자도 이해하기 쉬운 코드지만, 주석 및 문서화가 부족합니다." 
  },
  { 
    id: 4, 
    mode: 'STUDY', 
    link: "[feat/#4]: 모드선택 버튼 제작", 
    date: '2023.01.04', 
    content: "전체적인 코드 구조는 적절하나, 내부 로직이 복잡하여 분리하면 더 좋을 것 같습니다." 
  },
  { 
    id: 5, 
    mode: 'BASIC', 
    link: "[feat/#10] 모달창 구현", 
    date: '2023.01.05', 
    content: "기본적인 코드 패턴은 잘 따르고 있으나, 최적화 측면에서 개선할 부분이 보입니다." 
  },
  { 
    id: 6, 
    mode: 'STUDY', 
    link: "[feat/#14] 사이드바 (+버튼) 구현", 
    date: '2023.01.05', 
    content: "기본적인 코드 패턴은 잘 따르고 있으나, 최적화 측면에서 개선할 부분이 보입니다." 
  },
  { 
    id: 7, 
    mode: 'STUDY', 
    link: "[feat/#12] 리포트 리스트 컴포넌트 구현", 
    date: '2023.01.05', 
    content: "기본적인 코드 패턴은 잘 따르고 있으나, 최적화 측면에서 개선할 부분이 보입니다." 
  },
  { 
    id: 8, 
    mode: 'OPTIMIZE', 
    link: "[docs/#19] 파일 경로 수정 및 라우팅 설정", 
    date: '2023.01.05', 
    content: "기본적인 코드 패턴은 잘 따르고 있으나, 최적화 측면에서 개선할 부분이 보입니다." 
  },
  { 
    id: 9, 
    mode: 'OPTIMIZE', 
    link: "Design/#21 리포지토리 페이지 구현", 
    date: '2023.01.05', 
    content: "기본적인 코드 패턴은 잘 따르고 있으나, 최적화 측면에서 개선할 부분이 보입니다." 
  },
  { 
    id: 10, 
    mode: 'OPTIMIZE', 
    link: "[feat/#18] history페이지 구현", 
    date: '2023.01.05', 
    content: "기본적인 코드 패턴은 잘 따르고 있으나, 최적화 측면에서 개선할 부분이 보입니다." 
  },
  { 
    id: 11, 
    mode: 'CLEAN', 
    link: "[refactor/#41] API명세서에 맞춘 코드 수정", 
    date: '2023.01.05', 
    content: "기본적인 코드 패턴은 잘 따르고 있으나, 최적화 측면에서 개선할 부분이 보입니다." 
  },
  { 
    id: 12, 
    mode: 'CLEAN', 
    link: "[feat/#38] Report에 사용된 PR 모드 확인 기능 추가 및 이전 코드 보완", 
    date: '2023.01.05', 
    content: "기본적인 코드 패턴은 잘 따르고 있으나, 최적화 측면에서 개선할 부분이 보입니다." 
  },
  { 
    id: 13, 
    mode: 'NEWBIE', 
    link: "[feat] 전체 PR 모드 카테고리 통계 조회, 리팩토링", 
    date: '2023.01.05', 
    content: "기본적인 코드 패턴은 잘 따르고 있으나, 최적화 측면에서 개선할 부분이 보입니다." 
  },
  { 
    id: 14, 
    mode: 'OPTIMIZE', 
    link: "[docs/#19] 파일 경로 수정 및 라우팅 설정", 
    date: '2023.01.05', 
    content: "기본적인 코드 패턴은 잘 따르고 있으나, 최적화 측면에서 개선할 부분이 보입니다." 
  },
  { 
    id: 15, 
    mode: 'OPTIMIZE', 
    link: "[docs/#19] 파일 경로 수정 및 라우팅 설정", 
    date: '2023.01.05', 
    content: "기본적인 코드 패턴은 잘 따르고 있으나, 최적화 측면에서 개선할 부분이 보입니다." 
  },
  { 
    id: 16, 
    mode: 'OPTIMIZE', 
    link: "[docs/#19] 파일 경로 수정 및 라우팅 설정", 
    date: '2023.01.05', 
    content: "기본적인 코드 패턴은 잘 따르고 있으나, 최적화 측면에서 개선할 부분이 보입니다." 
  }
  
];

const Reviews = ({ onReviewClick, selectedMode, searchTerm, isDarkMode }) => {
  const [selectedReviewId, setSelectedReviewId] = useState(null);

  const handleReviewClick = (review) => {
    setSelectedReviewId(review.id);
    onReviewClick(review.content);
  };

  const filteredReviews = dummyReviews.filter(review => {
    const matchesMode = !selectedMode || selectedMode === '' || review.mode === selectedMode;
    const matchesSearch = !searchTerm || review.link.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesMode && matchesSearch;
  });

  return (
    <ReviewsContainer isDarkMode={isDarkMode}>
      {filteredReviews.map(review => (
        <ReviewItem 
          key={review.id}
          isSelected={selectedReviewId === review.id}
          isDarkMode={isDarkMode}
          onClick={() => handleReviewClick(review)}
        >
          <ReviewSummary>
            <ReviewMode mode={review.mode}>
              {review.mode}
            </ReviewMode>
            <ReviewLink isDarkMode={isDarkMode}>
              {review.link}
            </ReviewLink>
            <ReviewDate isDarkMode={isDarkMode}>
              {review.date}
            </ReviewDate>
            <ReviewArrow isDarkMode={isDarkMode}>
              →
            </ReviewArrow>
          </ReviewSummary>
        </ReviewItem>
      ))}
    </ReviewsContainer>
  );
};

export default Reviews;