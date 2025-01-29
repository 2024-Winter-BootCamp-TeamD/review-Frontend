// src/components/RadialBarChart/RadialBarChart.jsx

import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import styled from "styled-components";
import { getSelectedPRReviews } from "../../services/prReviewService";
import LoadingIndicator from "../LoadingIndicator/LoadingIndicator.jsx";

const ChartContainer = styled.div`
  width: 800px;
  max-width: 100%;
  height: 600px;
  padding: 20px;
  margin: 100px auto;
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
`;

const RadialBarChart = ({ selectedPrIds }) => {
  const [prScoreData, setPrScoreData] = useState({ title: [], series: [] });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const transformPrReviewData = (apiData) => {
    if (!apiData?.length) return { title: [], series: [] };
    const title = apiData.map(pr => pr.title);
    const categories = [...new Set(apiData.map(pr => pr.category))];
    const categoryData = {};
    const gradeToScore = { S: 100, A: 80, B: 60, C: 40, D: 20 };
    categories.forEach(category => {
      categoryData[category] = new Array(apiData.length).fill(0);
    });
    apiData.forEach((pr, index) => {
      if (categoryData[pr.category]) {
        categoryData[pr.category][index] = gradeToScore[pr.aver_grade] || 0;
      }
    });
    const series = Object.entries(categoryData).map(([name, data]) => ({ name, data }));
    return { title, series };
  };

  useEffect(() => {
    const fetchPrData = async () => {
      if (!selectedPrIds?.length) return;
      try {
        setIsLoading(true);
        setError(null);
        const response = await getSelectedPRReviews(selectedPrIds); // 인자 수정
        console.log("📌 선택된 PR ID 리스트:", selectedPrIds);
        console.log("📌 변환된 PR ID:", selectedPrIds?.join(","));
        if (!response?.data?.length) {
          throw new Error("선택된 PR 데이터가 없습니다");
        }
        setPrScoreData(transformPrReviewData(response.data));
      } catch (err) {
        console.error("데이터 불러오기 실패:", err);
        setError(err.message || "차트 데이터를 불러올 수 없습니다");
      } finally {
        setIsLoading(false);
      }
    };
    fetchPrData();
  }, [selectedPrIds]);

  const chartOptions = {
    colors: ["#FF794E", "#BC6FCD", "#70BF73", "#4DABF5", "#FFCD39"],
    chart: { type: "column", polar: true },
    title: { text: "PR별 점수 지표" },
    xAxis: {
      categories: prScoreData.title,
      labels: { style: { fontSize: "13px" } },
      lineWidth: 0,
      gridLineWidth: 0,
    },
    yAxis: {
      min: 0,
      max: 100,
      title: { text: "점수", align: "high" },
      labels: { format: "{value}점" },
      gridLineWidth: 5,
    },
    plotOptions: {
      column: {
        stacking: "normal",
        borderWidth: 0,
        pointPadding: 0,
        groupPadding: 0.15,
        borderRadius: "50%",
      },
    },
    series: prScoreData.series,
    accessibility: { enabled: true },
    exporting: { enabled: false },
    credits: { enabled: false }
  };

  return (
    <ChartContainer>
      {isLoading ? (
        <LoadingIndicator />
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : prScoreData.series.length === 0 ? (
        <div className="no-data">표시할 데이터가 없습니다</div>
      ) : (
        <HighchartsReact highcharts={Highcharts} options={chartOptions} />
      )}
    </ChartContainer>
  );
};

RadialBarChart.propTypes = {
  selectedPrIds: PropTypes.arrayOf(PropTypes.number).isRequired,
};

export default RadialBarChart;
