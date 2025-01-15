//src/components/Reviews/Reviews.jsx
import React from 'react';
import './Reviews.css';

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


const Reviews = ({ onReviewClick, selectedMode, searchTerm }) => {
  const filteredReviews = dummyReviews.filter(review => {
    // 모드 필터링
    const matchesMode =
      !selectedMode || selectedMode === '' || review.mode === selectedMode;
    // link 속성에서 검색어 필터링 (대소문자 구분 없이)
    const matchesSearch =
      !searchTerm || review.link.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesMode && matchesSearch;
  });

  return (
    <div className="reviews-container">
      {filteredReviews.map(review => (
        <div 
          key={review.id} 
          className="review-item"
          onClick={() => onReviewClick(review.content)}
          style={{ cursor: 'pointer' }}
        >
          <div className="review-summary">
            <div className={`review-mode ${review.mode.toLowerCase()}`}>
              {review.mode}
            </div>
            <div className="review-link">
              {review.link}
            </div>
            <div className="review-date">
              {review.date}
            </div>
            <div className="review-arrow">
              →
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Reviews;