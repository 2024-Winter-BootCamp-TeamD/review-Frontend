import React from 'react';
import './ReportList.css';
import reportImg from '../../assets/bitmap.png'; // Report 이미지 
import downloadIcon from '../../assets/download.png';
import deleteIcon from '../../assets/delete.png';


function ReportItem({ report }) {
  // 리포트에 사용 가능한 모든 모드 목록
  const allModes = ['Original', 'Clean Code', 'Study', 'Newbie', 'Basic'];

  // 모드 이름을 CSS 클래스 이름으로 변환. 예: "Clean Code" → "clean-code"
  const getModeClassName = (mode) =>
    mode.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="report-item">
      {/* 리포트 이미지 */}
      <div className="report-image">
        <img src={reportImg} alt="report" />
      </div>

      {/* 리포트 이름 */}
      <div className="report-name">{report.reportName}</div>

      {/* 날짜 */}
      <div className="report-date">{report.date}</div>

      {/* 코멘트 */}
      <div className="report-comments">{report.comments}</div>

      {/* 사용된 모드*/}
      <div className="report-modes">
        <div className="modes-row">
          {allModes.slice(0, 2).map((mode) => (
            <label
              key={mode}
              className={`mode-label ${getModeClassName(mode)}`}
            >
              <input
                type="checkbox"
                checked={report.usedModes.includes(mode)}
                readOnly
              />
              <span>{mode}</span>
            </label>
          ))}
        </div>
        <div className="modes-row">
          {allModes.slice(2).map((mode) => (
            <label
              key={mode}
              className={`mode-label ${getModeClassName(mode)}`}
            >
              <input
                type="checkbox"
                checked={report.usedModes.includes(mode)}
                readOnly
              />
              <span>{mode}</span>
            </label>
          ))}
        </div>
      </div>

      {/* 다운로드, 삭제 아이콘 */}
      <div className="report-actions">
        <img src={downloadIcon} alt="download" className="icon" />
        <img src={deleteIcon} alt="delete" className="icon" />
      </div>
    </div>
  );
}

function ReportList({ reports }) {
  return (
    <div className="report-list-container">
      {reports.map((report) => (
        <ReportItem key={report.id} report={report} />
      ))}
    </div>
  );
}
export default ReportList;
