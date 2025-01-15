import React, { useState, useEffect } from 'react';
import "./History.css";
import Chart from '../components/Chart/Chart';
import SearchBar from '../components/SearchBar/SearchBar';
import Reviews from '../components/Reviews/Reviews';

const History = () => {
  const [selectedReview, setSelectedReview] = useState('');
  const [selectedMode, setSelectedMode] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const handleReviewClick = (content) => {
    setSelectedReview(content);
  };

  const handleSliceClick = (mode) => {
    setSelectedMode(prevMode => (prevMode === mode ? '' : mode));
  };

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

          <div className="reviewList-box">
            <p className="box-title">All reviews</p>
            <div className="searchbar-container" style={{ width: '300px' }}>
              <SearchBar 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Reviews 
              onReviewClick={handleReviewClick} 
              selectedMode={selectedMode}
              searchTerm={searchTerm}
            />
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
