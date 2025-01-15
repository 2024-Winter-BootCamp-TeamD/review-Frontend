import React, { useState, useEffect } from 'react';
import "./History.css";
import Chart from '../components/Chart/Chart';
import SearchBar from '../components/SearchBar/SearchBar';
import Reviews from '../components/Reviews/Reviews';

const History = () => {
  const [selectedReview, setSelectedReview] = useState('');
  const [selectedMode, setSelectedMode] = useState(''); 
  // 검색어 상태
  const [searchTerm, setSearchTerm] = useState('');

  const handleReviewClick = (content) => {
    setSelectedReview(content);
  };

  // 차트에서 특정 모드 클릭 시 모드 토글
  const handleSliceClick = (mode) => {
    if (selectedMode === mode) {
      setSelectedMode(''); 
    } else {
      setSelectedMode(mode);
    }
  };

  // 컴포넌트 로드시 창 리사이즈 이벤트 발생
  // (이로 인해 페이지의 박스 크기가 올바르게 재계산됩니다)
  useEffect(() => {
    window.dispatchEvent(new Event('resize'));
  }, []);

  return (
    <div className="history-container">
      <div className="pageName">
        <p>History</p>
      </div>

      <div className="content-wrapper">
        <div className="left-container">

          {/* 차트 영역 */}
          <div className="chart-box">
            <p className="box-title">Mode Statistics</p>
            <Chart onSliceClick={handleSliceClick} selectedMode={selectedMode} />
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
                      mode === 'STUDY' ? '#FFC107' :
                      '#ccc'
                    }}>
                    <span className="legend-label">{mode}</span>
                  </div>
                  <div className="legend-count"> ……………… 12</div>
                </div>
              ))}
            </div>
          </div>

          {/* 리뷰 리스트 영역 */}
          <div className="reviewList-box">
            <p className="box-title">All reviews</p>

            {/* 검색창 - SearchBar */}
            <div className="searchbar-container" style={{ width: '300px' }}>
              {/*
                value: 현재 검색어
                onChange: 입력 변화 시 setSearchTerm
              */}
              <SearchBar 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* 리뷰 목록 컴포넌트(검색어와 선택된 모드 전달) */}
            <Reviews 
              onReviewClick={handleReviewClick} 
              selectedMode={selectedMode}
              searchTerm={searchTerm}
            />
          </div>
        </div>
        
        {/* 오른쪽 영역: 상세 리뷰 */}
        <div className="right-container">
          <div className="reviewDetails-box">
            <p className="box-title">Review</p>
            <pre className="review-detail-text">{selectedReview}</pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default History;
