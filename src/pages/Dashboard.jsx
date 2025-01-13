import React, { useState, useEffect } from "react";
import NotificationButton from "../components/NotificationButton/NotificationButton.jsx";
import ModeSelectButton from "../components/ModeselectButton/Modeselectbutton.jsx";
import "./Dashboard.css";
import { LineChart, Line, YAxis, Tooltip } from "recharts";
import { PieChart, Pie, Cell } from "recharts";

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

  const pieChartData = modes.map((mode) => ({
    name: mode.modeName,
    value: Math.floor(Math.random() * 500) + 100, // 임시 데이터
  }));

  const COLORS = ["#FF794E", "#9B9B9B", "#70BF73", "#4DABF5", "#FFCD39"];

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <div className="profile-section">
          <img
            src="https://avatars.githubusercontent.com/u/68336444?v=4"
            alt="GitHub Profile"
            className="profile-image"
          />
          <div>
            <h3 className="username">Username</h3>
            <p className="commits">Commits: 42</p>
          </div>
        </div>
        <div className="github-graph">
          <p>GitHub Activity Graph (placeholder)</p>
        </div>
      </header>

      {/* Mode Select Buttons */}
      <div className="mode-select">
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

      {/* Graphs */}
      <div className="charts">
        <div className="line-chart">
          <h3>Average Grades by Date</h3>
          <LineChart width={400} height={300} data={chartData}>
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
            <Line type="monotone" dataKey="gradeValue" stroke="#8884d8" dot />
          </LineChart>
        </div>
        <div className="pie-chart">
          <h3>Mode Distribution</h3>
          <PieChart width={300} height={300}>
            <Pie
              data={pieChartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {pieChartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;