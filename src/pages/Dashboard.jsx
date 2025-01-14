import React, { useState, useEffect } from "react";
import ModeSelectButton from "../components/ModeselectButton/ModeSelectButton.jsx";
import "./Dashboard.css";
import { LineChart, Line, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const Dashboard = () => {
  const initialData = {
    Basic: [
      { date: "2025-01-10", grade: "A" },
      { date: "2025-01-11", grade: "B" },
      { date: "2025-01-12", grade: "A" },
    ],
    "Clean Code": [
      { date: "2025-01-10", grade: "C" },
      { date: "2025-01-11", grade: "B" },
    ],
    Optimize: [
      { date: "2025-01-11", grade: "A" },
      { date: "2025-01-12", grade: "S" },
    ],
    Newbie: [
      { date: "2025-01-11", grade: "A" },
      { date: "2025-01-12", grade: "F" },
    ],
    Study: [
      { date: "2025-01-11", grade: "B" },
      { date: "2025-01-12", grade: "C" },
    ],
  };

  const gradeToValue = { S: 7, A: 6, B: 5, C: 4, D: 3, E: 2, F: 1, 0: 0 };
  // 라인차트 툴팁 컴포넌트
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const gradeValue = payload[0].value; // 첫 번째 데이터의 값 가져오기
      const gradeKey = Object.keys(gradeToValue).find(
        (key) => gradeToValue[key] === gradeValue
      ); // gradeValue에 해당하는 등급 찾기
      return (
        <div
          style={{
            backgroundColor: "#FFFFFF",
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
      const allDates = ["2025-01-10", "2025-01-11", "2025-01-12"];
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

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <div className="profile-container">
            <div className="profile-section">
                <img
                src="https://avatars.githubusercontent.com/u/68336444?v=4"
                alt="GitHub Profile"
                className="profile-image"
                />
                <h3 className="username">Username</h3>
            </div>
        </div>

        {/* GitHub Contributions Graph */}
        <div className="github-graph">
            <img
            src="https://ghchart.rshah.org/Nekerworld" /* GitHub 그래프 URL */
            alt="GitHub Contributions"
            className="contributions-graph"
            />
        </div>
      </header>

      {/* Mode Select Buttons */}
      <div className="mode-select" style={{ justifyContent: "space-between" }}>
        {modes.map((mode) => (
          <ModeSelectButton
            key={mode.modeName}
            modeName={mode.modeName}
            description={mode.description}
            modeColor={mode.modeColor}
            isSelected={selectedMode === mode.modeName}
            onClick={() => setSelectedMode(mode.modeName)}
          />
        ))}
      </div>

      {/* Charts */}
      <div className="charts">
        <div className="line-chart">
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
                  fill: "#000000", // 텍스트 색상
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
              <Tooltip content={<CustomTooltip/>}/>
              <Line 
                type="monotone" 
                dataKey="gradeValue" 
                stroke="#000000" 
                strokeWidth={8}
                filter="url(#lineShadow)"
                shad
                dot={({ cx, cy }) => (
                  <circle
                    cx={cx}
                    cy={cy}
                    r={5} // 점의 크기
                    fill="#FFFFFF" // 점의 색상
                    stroke="#000000" // 점의 외곽선 제거
                  />
                )}
                 />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="donut-chart-container">
          <div className="chart-wrapper">
            <div className="chart-title">
              <h3>Issue Type</h3>
              <p>Based on the latest 10 reviews</p>
            </div>
          </div>
          <div className="content-wrapper">
            <div className="legend">
              {pieChartData.map((entry, index) => (
                <div
                  key={index}
                  className="legend-item"
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
            <div className="chart">
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
                          highlightIndex === index ? "floating" : "" 
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