import React, { useState, useEffect, useCallback } from "react";
import PropTypes from 'prop-types';
import ModeSelectButton from "../components/ModeselectButton/ModeSelectButton.jsx";
import "./Dashboard.css";
import { LineChart, Line, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import api from "../services/api.jsx";
import { fetchUserInfo, getAverageGrade, getRecentReview } from "../services/DashboardService.jsx";
import GitHubCalendar from "react-github-calendar";
import LoadingIndicator from '../components/LoadingIndicator/LoadingIndicator';

// 등급을 값으로 변환하는 매핑
const gradeToValue = {
  S: 7,
  A: 6,
  B: 5,
  C: 4,
  D: 3,
  E: 2,
  F: 1,
  0: 0
};

// 값에서 등급으로 변환하는 매핑 (Y축 레이블용)
const valueToGrade = {
  7: 'S',
  6: 'A',
  5: 'B',
  4: 'C',
  3: 'D',
  2: 'E',
  1: 'F',
  0: '0'
};

const Username = ({ username }) => {
  const [fontSize, setFontSize] = useState("24px");
  
  useEffect(() => {
    if (username.length > 10) {
      setFontSize("2vh"); // 글자 길이가 10자를 넘으면 폰트 크기 줄임
    } else {
      setFontSize("3.5vh"); // 기본 폰트 크기
    }
  }, [username]);

  return (
    <h3
      className="dashboard-username"
      style={{
        fontSize: fontSize,
        textAlign: "center",
        wordWrap: "break-word",
        whiteSpace: "normal",
        maxWidth: "100%",
      }}
    >
      {username || "Username"}
    </h3>
  );
};

Username.propTypes = {
  username: PropTypes.string.isRequired
};

// 커스텀 툴팁 컴포넌트
const CustomTooltip = ({ active, payload, label, isDarkMode }) => {
  if (active && payload && payload.length) {
    const gradeValue = payload[0].value;
    const gradeKey = valueToGrade[gradeValue] || "N/A";
    return (
      <div
        style={{
          backgroundColor: isDarkMode ? "#000000" : "#FFFFFF",
          padding: "10px",
          border: "1px solid #CCCCCC",
          borderRadius: "5px",
          textAlign: "left",
        }}
      >
        <p style={{ margin: 0 }}>{label}</p>
        <p style={{ margin: 0 }}>
          <strong>Average Grade:</strong> {gradeKey}
        </p>
      </div>
    );
  }
  return null;
};

const categoryDisplayNames = {
  optimize: "Optimize",
  clean: "Clean Code",
  // 필요에 따라 추가 매핑
};

const PieCustomTooltip = ({ active, payload, isDarkMode }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div
        style={{
          backgroundColor: isDarkMode ? "#000000" : "#FFFFFF",
          padding: "10px",
          border: "1px solid #CCCCCC",
          borderRadius: "5px",
          textAlign: "left",
        }}
      >
        <p style={{ margin: 0 }}><strong>{categoryDisplayNames[data.name] || data.name}</strong></p>
        {data.problems.map((p, idx) => (
          <p key={idx} style={{ margin: 0 }}>
            {`${p.problem_type}: ${p.count}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const Dashboard = ({ isDarkMode }) => {
  const [username, setUsername] = useState("Nekerworld");
  const [profileLoaded, setProfileLoaded] = useState(false);
  const [selectedMode, setSelectedMode] = useState("Basic");
  const [chartData, setChartData] = useState([]);
  const [pieChartData, setPieChartData] = useState([]);
  const [highlightIndex, setHighlightIndex] = useState(0);
  const [fetchuserdata, setFetchUserData] = useState(null);

  useEffect(() => {
    const loadUserInfo = async () => {
      try {
        const userInfo = await fetchUserInfo();
        setUsername(userInfo.user_details.github_username);
        setSelectedMode(userInfo.review_mode || "Basic");
        setProfileLoaded(true);
        setFetchUserData(userInfo);
      } catch (error) {
        console.error("사용자 데이터를 불러오는 중 오류 발생:", error);
      }
    };

    loadUserInfo();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [averageGradeResponse, recentReviewData] = await Promise.all([
          getAverageGrade(),  // 라인차트
          getRecentReview(),  // 도넛차트
        ]);

        // 평균 등급 데이터 처리
        const averageGradeData = averageGradeResponse.data.map(item => ({
          date: item.date,
          average_grade: gradeToValue[item.average_grade] || 0,
        }));
        setChartData(averageGradeData);
        console.log("Chart Data:", averageGradeData); // 데이터 확인

        // 최근 리뷰 데이터 그룹화 및 파이 차트 데이터 설정
        const groupedData = recentReviewData.data.reduce((acc, item) => {
          if (!acc[item.category]) {
            acc[item.category] = {
              name: item.category,
              value: 0,
              problems: [],
            };
          }
          acc[item.category].value += item.count;
          acc[item.category].problems.push({
            problem_type: item.problem_type,
            count: item.count,
          });
          return acc;
        }, {});
        const pieData = Object.values(groupedData);
        setPieChartData(pieData);
      } catch (error) {
        console.error("데이터를 가져오는 중 오류 발생:", error);
      }
    };

    if (profileLoaded) {
      fetchData();
    }
  }, [profileLoaded]);

  const handleModeChange = useCallback(async (mode) => {
    if (!fetchuserdata) {
      console.error("사용자 데이터가 로드되지 않았습니다.");
      return;
    }
    const user_id = fetchuserdata.user_details.id;
    try {
      const response = await api.put(`/users/${user_id}/mode/`, {
        review_mode: mode.toLowerCase(), // 소문자로 변환하여 전송 (예: 'clean mode')
      });
      // 서버 응답에 따라 모드 업데이트
      setSelectedMode(response.data.review_mode);
      console.log("모드 변경 성공:", response.data);
    } catch (error) {
      console.error("모드 변경 실패:", error);
    }
  }, [fetchuserdata]);

  // 왼쪽 범례 하이라이트 색 | 하이라이트되지 않은 차트 색 (투명) | 왼쪽 범례 하이라이트 되지 않은 색
  const PIE_COLORS_LEGEND = ["#AEF060", "#DCDCDC00", "#343C2F"];

  useEffect(() => {
    const interval = setInterval(() => {
      setHighlightIndex((prevIndex) => (prevIndex + 1) % pieChartData.length);
    }, 5000); // 5초마다 변경
    return () => clearInterval(interval); // 컴포넌트 언마운트 시 클리어
  }, [pieChartData.length]);

  useEffect(() => {
    if (isDarkMode) {
      // 다크 모드일 때 스타일 설정
      document.body.style.backgroundColor = "#121212";
      document.body.style.color = "#ffffff";
    } else {
      // 라이트 모드일 때 스타일 설정
      document.body.style.backgroundColor = "#ffffff";
      document.body.style.color = "#000000";
    }
  }, [isDarkMode]);

  if (!fetchuserdata) {
    return <LoadingIndicator />;
  }

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        {profileLoaded && (
          <div className="dashboard-profile-container">
              <div className="dashboard-profile-section">
                  <img
                    src={`https://avatars.githubusercontent.com/u/${fetchuserdata.github_id}?v=4`}
                    alt="GitHub Profile"
                    className="dashboard-profile-image"
                  />
                  <Username username={username} />
              </div>
          </div>
        )}

        {/* GitHub Contributions Graph */}
        <div className="dashboard-github-graph">
          <GitHubCalendar
            username={username}
            showWeekdayLabels
            colorScheme={isDarkMode ? "dark" : "light"}
            theme={{
              light: ['#ebedf0', '#c6e48b', '#7bc96f', '#239a3b', '#196127'], // 밝은 테마 색상
              dark: ['#e0f7fa', '#80deea', '#26c6da', '#0097a7', '#006064'] // 어두운 테마 색상
            }}
          />
        </div>
      </header>

      {/* Mode Select Buttons */}
      <div className="dashboard-mode-select" style={{ justifyContent: "space-between" }}>
        <ModeSelectButton
          modeName="Basic"
          description="Default Mode."
          modeColor="#FF794E"
          isSelected={selectedMode === "basic mode"}
          onClick={() => handleModeChange("basic mode")}
        />
        <ModeSelectButton
          modeName="Study"
          description="Hint Only."
          modeColor="#FFCD39"
          isSelected={selectedMode === "study mode"}
          onClick={() => handleModeChange("study mode")}
        />
        <ModeSelectButton
          modeName="Clean Code"
          description="Follow Coding Conventions."
          modeColor="#4DABF5"
          isSelected={selectedMode === "clean mode"}
          onClick={() => handleModeChange("clean mode")}
        />
        <ModeSelectButton
          modeName="Optimize"
          description="Performance First."
          modeColor="#BC6FCD"
          isSelected={selectedMode === "optimize mode"}
          onClick={() => handleModeChange("optimize mode")}
        />
        <ModeSelectButton
          modeName="Newbie"
          description="Study Together."
          modeColor="#70BF73"
          isSelected={selectedMode === "new bie mode"}
          onClick={() => handleModeChange("new bie mode")}
        />
      </div>

      {/* Charts */}
      <div className="dashboard-charts">
        {/* 평균 등급 라인 차트 */}
        <div className="dashboard-line-chart">
          <h3>Average Grades</h3>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="90%" height="85%">
              <LineChart data={chartData}>
                <XAxis
                  dataKey="date"
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
                  }}
                  axisLine={true}
                  tickLine={true}
                  tick={{ fill: isDarkMode ? "#FFFFFF" : "#000000" }}
                />
                <YAxis
                  type="number"
                  domain={[0, 7]} // Y축 범위
                  ticks={[0, 1, 2, 3, 4, 5, 6, 7]} // Y축 틱 값
                  tickFormatter={(value) => valueToGrade[value] || ""}
                  allowDecimals={false}
                  axisLine={true}
                  tickLine={false}
                  tick={{
                    fontWeight: "bold",
                    fontSize: 12,
                    fill: isDarkMode ? "#FFFFFF" : "#000000",
                  }}
                />
                <Tooltip content={<CustomTooltip isDarkMode={isDarkMode} />} />
                <Line 
                  type="monotone" 
                  dataKey="average_grade" 
                  stroke={isDarkMode ? "#FFFFFF" : "#000000"} 
                  strokeWidth={4}
                  dot={({ cx, cy, index }) => (
                    <circle
                      key={`dot-${index}`}
                      cx={cx}
                      cy={cy}
                      r={7}
                      fill={isDarkMode ? "#000000" : "#FFFFFF"}
                      stroke={isDarkMode ? "#FFFFFF" : "#000000"}
                    />
                  )}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p>데이터를 불러오는 중...</p>
          )}
        </div>

        {/* 도넛 차트 */}
        <div className="dashboard-donut-chart-container">
          <div className="dashboard-chart-wrapper">
            <div className="dashboard-chart-title">
              <h3>Issue Type</h3>
              <p>Based on the latest 10 reviews</p>
            </div>
          </div>
          <div className="dashboard-content-wrapper">
            <div className="legend">
              {pieChartData.map((entry, index) => (
                <div
                  key={index}
                  className="dashboard-legend-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginRight: "20px",
                    backgroundColor:
                      highlightIndex === index ? PIE_COLORS_LEGEND[0] : PIE_COLORS_LEGEND[2],
                    color:
                      highlightIndex === index ? "#000000" : "#FFFFFF",
                    padding: "5px 10px",
                    borderRadius: "5px",
                    transition: "background-color 0.3s, color 0.3s",
                  }}
                >
                  <div
                    style={{
                      width: "0px",
                      height: "0px",
                      backgroundColor: PIE_COLORS_LEGEND[index % PIE_COLORS_LEGEND.length],
                      marginRight: "8px",
                      borderRadius: "2px",
                    }}
                  ></div>
                  <span>{categoryDisplayNames[entry.name] || entry.name}</span>
                </div>
              ))}
            </div>
            <div className="dashboard-chart">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  {/* 그라데이션 정의 */}
                  <defs>
                    {pieChartData.map((entry, index) => (
                      <linearGradient
                        id={`gradient-${index}`}
                        key={`gradient-${index}`}
                        x1="0"
                        y1="0"
                        x2="1"
                        y2="1"
                      >
                        <stop offset="0%" stopColor={highlightIndex === index ? "#2BE7CC" : "#DCDCDC00"} /> {/* 시작 색상 */}
                        <stop offset="100%" stopColor={highlightIndex === index ? "#AEF06099" : "#DCDCDC00"} /> {/* 끝 색상 */}
                      </linearGradient>
                    ))}
                  </defs>
                  {/* 배경용 도넛 차트 */}
                  <Pie
                    data={pieChartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius="70%"
                    innerRadius="25%"
                    strokeWidth={5}
                    isAnimationActive={false}
                  >
                    {/* 각 조각의 색상을 설정 */}
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 0 ? "#ABABAB" : index === 1 ? "#727272" : "#DCDCDC"} />
                    ))}
                  </Pie>
                  {/* 하이라이트 및 실제 데이터 차트 */}
                  <Pie
                    data={pieChartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={highlightIndex === pieChartData.indexOf(highlightIndex) ? "30%" : "65%"} // 선택된 조각은 약간 작게
                    innerRadius={highlightIndex === pieChartData.indexOf(highlightIndex) ? "1%" : "10%"} // 선택된 조각은 중심에 가까워짐
                    stroke="none"
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={`url(#gradient-${index})`}
                        className={
                          highlightIndex === index ? "dashboard-floating" : "" 
                        }
                      />
                    ))}
                  </Pie>
                  {/* 레이블용 Pie */}
                  <Pie
                    data={pieChartData}
                    dataKey="value"
                    cx="50%"
                    cy="50%"
                    outerRadius="60%"
                    innerRadius="25%"
                    fill="none" // 도넛 조각은 렌더링하지 않음
                    stroke="none"
                    label={({ percent, x, y }) => (
                      <g>
                        {/* 배경 박스 */}
                        <rect
                          x={x - 25}
                          y={y - 10}
                          width={50}
                          height={20}
                          fill="#FFFFFF"
                          rx={5}
                          ry={50}
                        />
                        {/* 텍스트 */}
                        <text
                          x={x}
                          y={y}
                          fill="#000000"
                          textAnchor="middle"
                          dominantBaseline="central"
                          style={{
                            fontSize: "14px",
                            fontWeight: "bold",
                          }}
                        >
                          {`${Math.round(percent * 100)}%`}
                        </text>
                      </g>
                    )}
                  />
                  <Tooltip content={<PieCustomTooltip isDarkMode={isDarkMode} />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

Dashboard.propTypes = {
  isDarkMode: PropTypes.bool.isRequired,
};

export default Dashboard;