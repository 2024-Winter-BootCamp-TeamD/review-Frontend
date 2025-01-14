import React, { useState } from 'react';
import "./History.css";
import Chart from '../components/Chart/Chart';
import SearchBar from '../components/SearchBar/SearchBar';
import Reviews from '../components/Reviews/Reviews';

const History = () => {
  const [selectedReview, setSelectedReview] = useState('');
  const [selectedMode, setSelectedMode] = useState(''); // 추가: 선택된 모드 관리

  const handleReviewClick = (content) => {
    setSelectedReview(content);
  };

  // Chart에서 클릭 이벤트 발생 시 호출할 콜백 함수
  const handleSliceClick = (mode) => {
    // 이미 클릭한 모드일 경우에는 초기화 (모드 선택 해제)
    if(selectedMode === mode) {
      setSelectedMode('');
    } else {
      setSelectedMode(mode);
    }
  };

  return (
    <div className="history-container">
      {/* 페이지 타이틀 */}
      <div className="pageName">
        <p>History</p>
      </div>

      {/* 전체 레이아웃: 왼쪽 영역과 오른쪽 영역 */}
      <div className="content-wrapper">
        {/* 왼쪽 영역 (차트 & 리뷰리스트) */}
        <div className="left-container">
          <div className="chart-box">
            <p className="box-title">Mode Statistics</p>
            {/* Chart에 onSliceClick 콜백과 현재 선택된 모드 전달 */}
            <Chart onSliceClick={handleSliceClick} selectedMode={selectedMode} />
            {/* 차트 영역의 각 수를 나타내는 범례(더미 데이터) */}
            <div className="chart-legend">
              {['BASIC', 'CLEAN', 'OPTIMIZE', 'NEWBIE', 'STUDY'].map((mode) => (
                <div className="legend-container" key={mode} 
                  style={{ opacity: selectedMode === '' || selectedMode === mode ? 1 : 0.3 }}>
                  <div 
                    className="legend-item" 
                    style={{ backgroundColor: 
                      mode === 'BASIC' ? '#FF5722' :
                      mode === 'CLEAN' ? '#9E9E9E' :
                      mode === 'OPTIMIZE' ? '#4CAF50' :
                      mode === 'NEWBIE' ? '#2196F3' :
                      mode === 'STUDY' ? '#FFC107' : '#ccc'
                    }}>
                    <span className="legend-label">{mode}</span>
                  </div>
                  <div className="legend-count"> ……………… 12</div>
                </div>
              ))}
            </div>
          </div>
          <div className="reviewList-box">
            <p className="box-title">All reviews</p>
            {/* 우측 상단에 서치바 배치 */}
            <div className="searchbar-container" style={{ width: '300px' }}>
              <SearchBar />
            </div>
            {/* 리뷰목록 (스크롤 적용) - Reviews 컴포넌트에 현재 선택된 모드를 prop으로 전달 */}
            <Reviews onReviewClick={handleReviewClick} selectedMode={selectedMode} />
          </div>  
        </div>
        
        {/* 오른쪽 영역 (리뷰내용) */}
        <div className="right-container">
          <div className="reviewDetails-box">
            <p className="box-title">Review</p>
            {/* 클릭한 리뷰 내용 표시 */}
            <pre className="review-detail-text">{selectedReview}</pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default History;
