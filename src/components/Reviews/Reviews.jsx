import React from 'react';
import './Reviews.css';

const dummyReviews = [
  { 
    id: 1, 
    mode: 'CLEAN', 
    link: "Feat/#68 수정하기api 반환값에 origin_url추가", 
    date: '2023.01.01', 
    content: "코드 가독성이 우수하며, 함수 이름이 직관적입니다." 
  },
  { 
    id: 2, 
    mode: 'OPTIMIZE', 
    link: "Feat/#48 modified_html 함수 Celary로 비동기", 
    date: '2023.01.02', 
    content: "비동기 처리 부분이 잘 구현되었으나, 몇몇 매직 넘버에 개선 여지가 있습니다." 
  },
  { 
    id: 3, 
    mode: 'NEWBIE', 
    link: "Feat/#68 수정하기api 반환값에 origin_url추가", 
    date: '2023.01.03', 
    content: "초보자도 이해하기 쉬운 코드지만, 주석 및 문서화가 부족합니다." 
  },
  { 
    id: 4, 
    mode: 'STUDY', 
    link: "Feat/#51 검토결과 - tasks.py 비동기 처리추가", 
    date: '2023.01.04', 
    content: "전체적인 코드 구조는 적절하나, 내부 로직이 복잡하여 분리하면 더 좋을 것 같습니다." 
  },
  { 
    id: 5, 
    mode: 'BASIC', 
    link: "Feat/#68 수정하기api 반환값에 origin_url추가", 
    date: '2023.01.05', 
    content: "기본적인 코드 패턴은 잘 따르고 있으나, 최적화 측면에서 개선할 부분이 보입니다." 
  },
];

const Reviews = ({ onReviewClick, selectedMode }) => {
  // 만약 selectedMode가 설정되어 있으면 필터링, 아니면 전체 출력
  const filteredReviews = selectedMode 
    ? dummyReviews.filter(review => review.mode === selectedMode)
    : dummyReviews;

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
            <div className={`review-mode ${review.mode.toLowerCase()}`}>{review.mode}</div>
            <div className="review-link">{review.link}</div>
            <div className="review-date">{review.date}</div>
            <div className="review-arrow">→</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Reviews;
