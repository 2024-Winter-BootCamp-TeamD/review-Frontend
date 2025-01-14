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

  const PIE_COLORS = ["#AEF060", "#DCDCDC00", "#343C2F", "#AEF06075"];
  const [highlightIndex, setHighlightIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setHighlightIndex((prevIndex) => (prevIndex + 1) % pieChartData.length);
    }, 8000); // 2초마다 변경
    return () => clearInterval(interval); // 컴포넌트 언마운트 시 클리어
  }, [pieChartData.length]);

  const COLORS = ["#FF794E", "#9B9B9B", "#70BF73", "#4DABF5", "#FFCD39"];

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
          <ResponsiveContainer width="90%" height="90%">
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
                domain={[0, 7]}
                ticks={[0, 1, 2, 3, 4, 5, 6, 7]}
                tickFormatter={(value) =>
                  Object.keys(gradeToValue).find((key) => gradeToValue[key] === value) || ""
                }
                allowDecimals={false}
              />
              <Tooltip
                formatter={(value) =>
                  Object.keys(gradeToValue).find((key) => gradeToValue[key] === value) || "N/A"
                }
                labelFormatter={(label) => `Date: ${label}`}
              />
              <Line 
                type="monotone" 
                dataKey="gradeValue" 
                stroke="#8884d8" 
                strokeWidth={8}
                shad
                dot />
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
                        <stop offset="0%" stopColor={highlightIndex === index ? "#AEF06095" : "#DCDCDC00"} /> {/* 시작 색상 */}
                        <stop offset="100%" stopColor={highlightIndex === index ? "#29E7CD85" : "#DCDCDC00"} /> {/* 끝 색상 */}
                      </linearGradient>
                    ))}
                  </defs>
                  {/* 배경용 도넛 차트 */}
                  <Pie
                    data={pieChartData} // 동일한 데이터 사용
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius="70%" // 배경 차트 크기
                    innerRadius="25%"
                    fill="#DCDCDC" // 배경 색상
                    isAnimationActive={false} // 애니메이션 비활성화
                    label={({ percent, x, y }) => (
                      <text
                        x={x}
                        y={y}
                        fill="#000000" // 텍스트 색상
                        textAnchor="middle"
                        dominantBaseline="central"
                        style={{
                          fontSize: "14px",
                          fontWeight: "bold",
                          background: "#FFFFFF",
                          padding: "5px",
                          borderRadius: "5px",
                        }}
                      >
                        {`${Math.round(percent * 100)}%`}
                      </text>
                    )}
                  />

                  {/* 하이라이트 및 실제 데이터 차트 */}
                  <Pie
                    data={pieChartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={highlightIndex === pieChartData.indexOf(highlightIndex) ? "30%" : "60%"} // 선택된 조각은 약간 작게
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