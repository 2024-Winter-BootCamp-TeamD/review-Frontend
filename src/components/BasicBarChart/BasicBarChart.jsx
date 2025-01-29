// src/components/BasicBarChart/BasicBarChart.jsx

import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import styled from "styled-components";
import { getSelectedPRReviews } from "../../services/prReviewService";
import LoadingIndicator from "../LoadingIndicator/LoadingIndicator";

const ChartContainer = styled.div`
  min-width: 310px;
  max-width: 800px;
  margin: 2em auto;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const BasicBarChart = ({ selectedPrIds }) => {
  const [chartData, setChartData] = useState({ 
    categories: ["S", "A", "B", "C", "D"], 
    series: [] 
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // 데이터 변환 함수
  const transformData = (apiData) => {
    const gradeOrder = { S: 0, A: 1, B: 2, C: 3, D: 4 };
    const issueTypes = [
      "코드 구조", "성능", "보안", 
      "가독성", "버그 가능성",
      "기타 유형" // 추가
    ];

    const initializeData = () => 
      Object.fromEntries(issueTypes.map(type => [type, [0, 0, 0, 0, 0]]));

    const issueData = initializeData();
    
    apiData?.forEach(({ aver_grade, problem_type }) => {
      if (!aver_grade || !problem_type) {
        console.warn("PR review missing aver_grade or problem_type:", { aver_grade, problem_type });
        return;
      }
      
      const gradeIdx = gradeOrder[aver_grade.toUpperCase()];
      if (gradeIdx === undefined) {
        console.warn("Invalid aver_grade:", aver_grade);
        return;
      }
      
      const type = issueTypes.includes(problem_type) 
        ? problem_type 
        : "기타 유형";
        
      if (issueData[type]) { 
        issueData[type][gradeIdx] += 1;
      }
    });

    console.log("Issue Data:", issueData);

    const transformedData = {
      categories: Object.keys(gradeOrder),
      series: Object.entries(issueData)
        .filter(([_, data]) => data.some(v => v > 0))
        .map(([name, data]) => ({ name, data }))
    };

    console.log("Transformed Chart Data:", transformedData);

    return transformedData;
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!selectedPrIds?.length) {
        setChartData({ categories: ["S", "A", "B", "C", "D"], series: [] });
        setIsLoading(false);
        return;
      }
      try {
        setIsLoading(true);
        setError(null);
        const response = await getSelectedPRReviews(selectedPrIds); // 인자 수정
        console.log("📊 BasicBarChart API Response:", response);
        const prReviews = response.data; // response.data가 Array(8)임

        if (!prReviews || prReviews.length === 0) {
          throw new Error("No PR data available");
        }

        const transformedData = transformData(prReviews);
        setChartData(transformedData);
      } catch (err) {
        console.error("📊 BasicBarChart Data fetch error:", err);
        setError(err.message || "데이터 로딩 실패");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [selectedPrIds]);

  const chartOptions = {
    chart: {
      type: "bar", // 'bar'로 변경
      height: 600,
      backgroundColor: "#FFFFFF"
    },
    title: { text: "" },
    xAxis: {
      categories: chartData.categories,
      title: { text: "등급" },
      gridLineWidth: 5,
      lineWidth: 1
    },
    yAxis: {
      min: 0,
      title: { text: "개수", align: "high" },
      labels: { overflow: "justify" },
      gridLineWidth: 0,
      lineWidth: 1
    },
    tooltip: { valueSuffix: " 개" },
    plotOptions: {
      bar: {
        borderRadius: 10, // 숫자로 수정
        dataLabels: { enabled: true },
        groupPadding: 0.2
      }
    },
    legend: {
      layout: "vertical",
      align: "right",
      verticalAlign: "top",
      floating: true,
      backgroundColor: "#FFFFFF",
      shadow: true
    },
    series: chartData.series,
    accessibility: { enabled: true },
    exporting: { enabled: false },
    credits: { enabled: false }
  };

  return (
    <ChartContainer>
      {isLoading ? (
        <LoadingIndicator />
      ) : error ? (
        <div className="error-message">⚠️ {error}</div>
      ) : chartData.series.length === 0 ? (
        <div className="no-data">📭 표시할 데이터가 없습니다</div>
      ) : (
        <HighchartsReact highcharts={Highcharts} options={chartOptions} />
      )}    
    </ChartContainer>
  );
};

BasicBarChart.propTypes = {
  selectedPrIds: PropTypes.arrayOf(PropTypes.number).isRequired,
};

export default BasicBarChart;
