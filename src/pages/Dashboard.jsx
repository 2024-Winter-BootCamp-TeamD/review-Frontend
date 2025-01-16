import React, { useState, useEffect } from "react";
import ModeSelectButton from "../components/ModeselectButton/ModeSelectButton.jsx";
import "./Dashboard.css";
import { LineChart, Line, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const Dashboard = ({ isDarkMode }) => {
  const username = "Nekerworld"; //Default
  const [profileLoaded, setProfileLoaded] = useState(false)
  useEffect(() => {
    setProfileLoaded(true);
  }, []);
  const Username = ({ username }) => {
    const [fontSize, setFontSize] = useState("24px");
  
    useEffect(() => {
      if (username.length > 10) {
        setFontSize("2vh"); // 글자 길이가 10자를 넘으면 폰트 크기를 줄임
      } else {
        setFontSize("3.5vh"); // 기본 폰트 크기
      }
    }, [username]);
    return (
      <h3
        className="dashboard-username"
        style={{
          fontSize: fontSize, // 동적으로 폰트 크기 설정
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

  const initialData = {
    Basic: [
      { date: "2025-01-09", grade: "A" },
      { date: "2025-01-10", grade: "D" },
      { date: "2025-01-11", grade: "B" },
      { date: "2025-01-12", grade: "F" },
      { date: "2025-01-13", grade: "A" },
      { date: "2025-01-14", grade: "S" },
    ],
    "Clean Code": [
      { date: "2025-01-09", grade: "A" },
      { date: "2025-01-10", grade: "D" },
      { date: "2025-01-11", grade: "B" },
      { date: "2025-01-12", grade: "A" },
      { date: "2025-01-13", grade: "S" },
      { date: "2025-01-14", grade: "S" },
    ],
    Optimize: [
      { date: "2025-01-09", grade: "F" },
      { date: "2025-01-10", grade: "D" },
      { date: "2025-01-11", grade: "B" },
      { date: "2025-01-12", grade: "A" },
      { date: "2025-01-13", grade: "E" },
      { date: "2025-01-14", grade: "S" },
    ],
    Newbie: [
      { date: "2025-01-09", grade: "F" },
      { date: "2025-01-10", grade: "E" },
      { date: "2025-01-11", grade: "B" },
      { date: "2025-01-12", grade: "A" },
      { date: "2025-01-13", grade: "S" },
      { date: "2025-01-14", grade: "S" },
    ],
    Study: [
      { date: "2025-01-09", grade: "B" },
      { date: "2025-01-10", grade: "D" },
      { date: "2025-01-11", grade: "F" },
      { date: "2025-01-12", grade: "A" },
      { date: "2025-01-13", grade: "S" },
      { date: "2025-01-14", grade: "B" },
    ],
  };

  const gradeToValue = { S: 7, A: 6, B: 5, C: 4, D: 3, E: 2, F: 1, 0: 0 };
  // 라인차트 툴팁 컴포넌트
  const CustomTooltip = ({ active, payload, label, isDarkMode }) => {
    if (active && payload && payload.length) {
      const gradeValue = payload[0].value; // 첫 번째 데이터의 값 가져오기
      const gradeKey = Object.keys(gradeToValue).find(
        (key) => gradeToValue[key] === gradeValue
      ); // gradeValue에 해당하는 등급 찾기
      return (
        <div
          style={{
            backgroundColor: isDarkMode ? "#000000" : "#FFFFFF", // 다크 모드일 때 배경색 설정
            padding: "10px",
            border: "1px solid #CCCCCC",
            borderRadius: "5px",
            textAlign: "left",
          }}
        >
          <p style={{ margin: 0 }}>{label}</p>
          <p style={{ margin: 0 }}>
            <strong>Average Grade:</strong> {gradeKey || "N/A"}
          </p>
        </div>
      );
    }
    return null; // 툴팁이 활성화되지 않으면 아무것도 렌더링하지 않음
  };  

  const [selectedMode, setSelectedMode] = useState("Basic");
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const processData = (modeData) => {
      const allDates = ["2025-01-09","2025-01-10", "2025-01-11", "2025-01-12","2025-01-13","2025-01-14"];
      return allDates.map((date) => {
        const entry = modeData.find((d) => d.date === date);
        return {
          date,
          gradeValue: entry ? gradeToValue[entry.grade] : 0,
        };
      });
    };

    setChartData(processData(initialData[selectedMode]));
  }, [selectedMode]);

  const modes = [
    { modeName: "Basic", description: "Default Mode.", modeColor: "#FF794E" },
    { modeName: "Clean Code", description: "Follow Coding Conventions.", modeColor: "#9B9B9B" },
    { modeName: "Optimize", description: "Performance First.", modeColor: "#70BF73" },
    { modeName: "Newbie", description: "Study Together.", modeColor: "#4DABF5" },
    { modeName: "Study", description: "Hint Only.", modeColor: "#FFCD39" },
  ];

  const issueCategories = ["Clean Code", "Memory", "Execution Time"];
  const recentReviews = [
    { id: 1, issues: ["Execution Time"] },
    { id: 2, issues: ["Memory"] },
    { id: 3, issues: ["Clean Code"] },
    { id: 4, issues: ["Execution Time"] },
    { id: 5, issues: ["Execution Time"] },
    { id: 6, issues: ["Memory"] },
    { id: 7, issues: ["Execution Time"] },
    { id: 8, issues: ["Execution Time"] },
    { id: 9, issues: ["Memory"] },
    { id: 10, issues: ["Clean Code"] },
  ];

  // 리뷰 데이터를 집계하여 각 카테고리별 문제 발생 횟수를 계산
  const pieChartData = issueCategories.map((category) => ({
    name: category,
    value: recentReviews.reduce(
      (count, review) => count + (review.issues.includes(category) ? 1 : 0),
      0
    ),
  }));

  // 왼쪽 범례 하이라이트 색 | 하이라이트되지 않은 차트 색 (투명) | 왼쪽 범례 하이라이트 되지 않은 색
  const PIE_COLORS = ["#AEF060", "#DCDCDC00", "#343C2F"];
  const [highlightIndex, setHighlightIndex] = useState(0);

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

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        {profileLoaded && (
          <div className="dashboard-profile-container">
              <div className="dashboard-profile-section">
                  <img
                  src={`https://avatars.githubusercontent.com/${username}`}
                  alt="GitHub Profile"
                  className="dashboard-profile-image"
                  />
                  <Username username={username} />
              </div>
          </div>
        )}

        {/* GitHub Contributions Graph */}
        <div className="dashboard-github-graph">
            <img
            src={`https://ghchart.rshah.org/${username}`} /* GitHub 그래프 URL */
            alt="GitHub Contributions"
            className="dashboard-contributions-graph"
            />
        </div>
      </header>

      {/* Mode Select Buttons */}
      <div className="dashboard-mode-select" style={{ justifyContent: "space-between" }}>
        {modes.map((mode) => (
          <ModeSelectButton
            key={mode.modeName}
            modeName={mode.modeName}
            description={mode.description}
            modeColor={mode.modeColor}
            isSelected={selectedMode === mode.modeName}
            onClick={() => setSelectedMode(mode.modeName)}
            isDarkMode={isDarkMode}
          />
        ))}
      </div>

      {/* Charts */}
      <div className="dashboard-charts">
        <div className="dashboard-line-chart">
          <h3>Average Grades</h3>
          <ResponsiveContainer width="90%" height="85%">
            <LineChart data={chartData}>
              <XAxis
                dataKey="date"
                tickFormatter={(value) => `Date: ${value}`}
                axisLine={true}
                tickLine={true}
                tick={false}
              />
              <YAxis
                type="number"
                domain={[0, 7]} // Y축 범위
                ticks={[0, 1, 2, 3, 4, 5, 6, 7]} // Y축 틱 값
                tickFormatter={(value) =>
                  Object.keys(gradeToValue).find((key) => gradeToValue[key] === value) || ""
                } // 라벨 값 설정
                allowDecimals={false}
                axisLine={true} // 세로축 선 제거
                tickLine={false} // 라벨과 연결된 가로선 제거
                tick={{
                  fontWeight: "bold", // 라벨 볼드 효과
                  dx: -20, // 라벨을 Y축에서 왼쪽(-)으로 10px 이동
                  fontSize: 12,
                  fill: isDarkMode ? "#FFFFFF" : "#000000", // 다크 모드일 때 흰색, 라이트 모드일 때 검정색
                }}
              />
              <defs>
                <filter id="lineShadow" x="-50%" y="-50%" width="400%" height="400%">
                  <feDropShadow
                    dx="8"       /* X축으로 그림자 이동 */
                    dy="10"       /* Y축으로 그림자 이동 */
                    stdDeviation="12" /* 그림자 흐림 정도 */
                    floodColor="#000000" /* 그림자 색상 */
                  />
                </filter>
              </defs>
              <Tooltip content={<CustomTooltip isDarkMode={isDarkMode} />} />
              <Line 
                type="monotone" 
                dataKey="gradeValue" 
                stroke={isDarkMode ? "#FFFFFF" : "#000000"} // 다크 모드일 때 흰색, 라이트 모드일 때 검정색
                strokeWidth={4}
                filter="url(#lineShadow)"
                dot={({ cx, cy }) => (
                  <circle
                    cx={cx}
                    cy={cy}
                    r={7} // 점의 크기
                    fill={isDarkMode ? "#000000" : "#FFFFFF"} // 다크 모드일 때 검정색, 라이트 모드일 때 흰색
                    stroke={isDarkMode ? "#FFFFFF" : "#000000"} // 다크 모드일 때 흰색, 라이트 모드일 때 검정색
                  />
                )}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
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
                    backgroundColor:
                      highlightIndex === index ? PIE_COLORS[0] : PIE_COLORS[2],
                    color:
                      highlightIndex === index ? "#000000" : "#FFFFFF",
                  }}
                >
                  {entry.name}
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
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard