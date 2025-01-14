import React, { useState } from 'react';
import "./History.css";
import Chart from '../components/Chart/Chart';
import SearchBar from '../components/SearchBar/SearchBar';
import Reviews from '../components/Reviews/Reviews';

const History = () => {
  const [selectedReview, setSelectedReview] = useState('');
  const [selectedMode, setSelectedMode] = useState(''); // 선택된 모드 관리

  const handleReviewClick = (content) => {
    setSelectedReview(content);
  };

  // Chart에서 클릭 이벤트 발생 시 호출할 콜백 함수
  const handleSliceClick = (mode) => {
    if (selectedMode === mode) {
      setSelectedMode(''); 
    } else {
      setSelectedMode(mode);
    }
  };

  return (
    <div className="history-container">
      <div className="pageName">
        <p>History</p>
      </div>

      <div className="content-wrapper">
        <div className="left-container">
          <div className="chart-box">
            <p className="box-title">Mode Statistics</p>
            {/* Chart에 onSliceClick와 selectedMode 전달 */}
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
            <div className="searchbar-container" style={{ width: '300px' }}>
              <SearchBar />
            </div>
            {/* Reviews에 selectedMode prop 전달 */}
            <Reviews onReviewClick={handleReviewClick} selectedMode={selectedMode} />
          </div>  
        </div>
        
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
