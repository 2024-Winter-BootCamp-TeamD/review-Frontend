import React from 'react';
import styled from 'styled-components';
import reportImg from '../../assets/bitmap.png';
import downloadIcon from '../../assets/download.png';
import deleteIcon from '../../assets/delete.png';

const ListContainer = styled.div`
  width: 1495px;
  height: 100px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  background-color: ${({ isDarkMode }) => (isDarkMode ? '#333333' : '#FFFFFF')};
`;

const Item = styled.div`
  display: flex;
  align-items: center;
  width: 1495px;
  height: 100px;
  border: 1px solid #ddd;
  padding: 0 10px;
  box-sizing: border-box;
  border-radius: 15px;
  box-shadow: 0 2px 5px rgba(0, 5, 0, 1);
  background-color: ${({ isDarkMode }) => (isDarkMode ? '#444444' : '#FFFFFF')};
  transition: background-color 0.3s ease;
`;

const ImageContainer = styled.div`
  img {
    width: 95px;
    height: 95px;
    object-fit: cover;
    border-radius: 4px;
  }
`;

const Name = styled.div`
  flex: 1;
  margin-left: 20px;
  font-size: 25px;
  font-weight: 600;
  color: #3353CA;
`;

const Date = styled.div`
  width: 120px;
  text-align: center;
  font-size: 20px;
  color: #04103B;
`;

const Comments = styled.div`
  flex: 2;
  margin-left: 10px;
  font-size: 20px;
  color: #797D8C;
`;

const Modes = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 10px;
  margin-right: 100px;
`;

const ModesRow = styled.div`
  display: flex;
  justify-content: left;
  gap: ${props => props.isFirst ? '38px' : '50px'};
  margin-bottom: 2px;
`;

const ModeLabel = styled.label`
  display: flex;
  align-items: center;
  font-size: 14px;
  color: ${props => {
    switch (props.mode.toLowerCase()) {
      case 'original': return '#4CAF50';
      case 'clean-code': return '#9E9E9E';
      case 'study': return '#FFC107';
      case 'newbie': return '#2196F3';
      case 'basic': return '#FF5722';
      default: return '#333';
    }
  }};

  input[type="checkbox"] {
    margin-right: 4px;
  }
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-left: auto;
`;

const Icon = styled.img`
  margin-right: 25px;
  width: 25px;
  height: 25px;
  cursor: pointer;
  object-fit: contain;
`;

function ReportItem({ report, isDarkMode }) {
  const allModes = ['Original', 'Clean Code', 'Study', 'Newbie', 'Basic'];
  const getModeClassName = (mode) => mode.toLowerCase().replace(/\s+/g, '-');

  return (
    <Item isDarkMode={isDarkMode}>
      <ImageContainer>
        <img src={reportImg} alt="report" />
      </ImageContainer>
      
      <Name>{report.reportName}</Name>
      <Date>{report.date}</Date>
      <Comments>{report.comments}</Comments>
      
      <Modes>
        <ModesRow isFirst>
          {allModes.slice(0, 2).map((mode) => (
            <ModeLabel key={mode} mode={getModeClassName(mode)}>
              <input
                type="checkbox"
                checked={report.usedModes.includes(mode)}
                readOnly
              />
              <span>{mode}</span>
            </ModeLabel>
          ))}
        </ModesRow>
        <ModesRow>
          {allModes.slice(2).map((mode) => (
            <ModeLabel key={mode} mode={getModeClassName(mode)}>
              <input
                type="checkbox"
                checked={report.usedModes.includes(mode)}
                readOnly
              />
              <span>{mode}</span>
            </ModeLabel>
          ))}
        </ModesRow>
      </Modes>

      <Actions>
        <Icon src={downloadIcon} alt="download" />
        <Icon src={deleteIcon} alt="delete" />
      </Actions>
    </Item>
  );
}

function ReportList({ reports, isDarkMode }) {
  return (
    <ListContainer isDarkMode={isDarkMode}>
      {reports.map((report) => (
        <ReportItem key={report.id} report={report} isDarkMode={isDarkMode} />
      ))}
    </ListContainer>
  );
}

export default ReportList;
