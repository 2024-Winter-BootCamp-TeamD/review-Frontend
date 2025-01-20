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
  justify-content: center;
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
  height: 45px;
  margin: 0;
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

const Reviews = ({ reviews, onReviewClick, selectedMode, searchTerm, isDarkMode, loading }) => {
  const [selectedReviewId, setSelectedReviewId] = useState(null);

  const handleReviewClick = (review) => {
    setSelectedReviewId(review.id);
    onReviewClick(review);
  };

  const filteredReviews = reviews.filter(review => {
    const matchesMode = !selectedMode || 
                       selectedMode === '' || 
                       review.review_mode.toUpperCase() === selectedMode;
    const matchesSearch = !searchTerm || 
                         review.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesMode && matchesSearch;
  });

  if (loading) {
    return <div>Loading...</div>;
  }

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
            <ReviewMode mode={review.review_mode.toUpperCase()}>
              {review.review_mode.toUpperCase()}
            </ReviewMode>
            <ReviewLink isDarkMode={isDarkMode}>
              {review.title}
            </ReviewLink>
            <ReviewDate isDarkMode={isDarkMode}>
              {new Date(review.created_at).toLocaleDateString()}
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