// src/components/BasicBarChart/BasicBarChart.jsx

import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Highcharts from "highcharts";
import HighchartsMore from "highcharts/highcharts-more"; // highcharts-more 모듈 추가
import ExportingModule from "highcharts/modules/exporting";
import ExportDataModule from "highcharts/modules/export-data";
import AccessibilityModule from "highcharts/modules/accessibility";
import HighchartsReact from "highcharts-react-official";
import styled from "styled-components";
import LoadingIndicator from "../LoadingIndicator/LoadingIndicator";
import { getSelectedPRReviews, fetchUserInfo } from "../../services/prReviewService";

// Highcharts 모듈 초기화
if (HighchartsMore && typeof HighchartsMore === "function") {
  HighchartsMore(Highcharts);
  console.log("HighchartsMore module initialized");
}
if (ExportingModule && typeof ExportingModule === "function") {
  ExportingModule(Highcharts);
  console.log("ExportingModule initialized");
}
if (ExportDataModule && typeof ExportDataModule === "function") {
  ExportDataModule(Highcharts);
  console.log("ExportDataModule initialized");
}
if (AccessibilityModule && typeof AccessibilityModule === "function") {
  AccessibilityModule(Highcharts);
  console.log("AccessibilityModule initialized");
}

// 카테고리별 색상 매핑
const categoryColorMap = {
  basic: "#FF794E",
  optimize: "#BC6FCD",
  newbie: "#70BF73",
  clean: "#4DABF5",
  study: "#FFCD39",
};

// 차트 컨테이너 스타일링
const ChartContainer = styled.div`
  min-width: 310px;
  max-width: 800px;
  margin: 2em auto;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  overflow: visible; /* 레이블이 잘리지 않도록 설정 */
`;

const BasicBarChart = ({ selectedPrIds }) => {
  const [chartData, setChartData] = useState({
    categories: [],
    series: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // aver_grade를 숫자로 매핑하는 객체
  const gradeToScore = { S: 100, A: 80, B: 60, C: 40, D: 20 };

  // 데이터 변환 함수: 각 카테고리별로 시리즈를 생성
  const transformData = (apiData) => {
    const categories = apiData.map((pr) => `PR ${pr.id}`);
    const modes = Object.keys(categoryColorMap);

    // 시리즈 초기화
    const series = modes.map((mode) => ({
      name: mode.charAt(0).toUpperCase() + mode.slice(1), // 첫 글자 대문자
      data: apiData.map((pr) =>
        pr.category.toLowerCase() === mode.toLowerCase()
          ? gradeToScore[pr.aver_grade.toUpperCase()] || 0
          : null
      ),
      color: categoryColorMap[mode],
      showInLegend: true,
      stacking: "normal",
    }));

    return {
      categories,
      series,
    };
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!selectedPrIds?.length) {
        setChartData({ categories: [], series: [] });
        setIsLoading(false);
        return;
      }
      try {
        setIsLoading(true);
        setError(null);
        const response = await getSelectedPRReviews(selectedPrIds); // API 호출
        console.log("📊 BasicBarChart API Response:", response);
        const prReviews = response.data; // Array of PR reviews

        if (!Array.isArray(prReviews)) {
          console.error(
            "Expected prReviews to be an array, but got:",
            typeof prReviews
          );
          throw new Error("잘못된 데이터 형식");
        }

        if (!prReviews.length) {
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
      type: "column", // 'column'으로 설정
      inverted: true, // 'inverted' 옵션 추가
      polar: true, // 'polar' 옵션 추가
      height: 600,
      backgroundColor: "#FFFFFF",
    },
    title: {
      text: "",
    },
    subtitle: {
      text: "",
      useHTML: true,
    },
    tooltip: {
      outside: true,
      shared: true,
      valueSuffix: " 점",
      formatter: function () {
        let tooltip = `<b>${this.x}</b><br/>`;
        this.points.forEach((point) => {
          if (point.y !== null) {
            tooltip += `<span style="color:${point.color}">\u25CF</span> ${point.series.name}: ${point.y} 점<br/>`;
          }
        });
        return tooltip;
      },
    },
    pane: {
      size: "85%",
      innerSize: "20%",
      endAngle: 270,
    },
    xAxis: {
      categories: chartData.categories,
      title: { text: "" },
      tickInterval: 1,
      labels: {
        align: "right",
        useHTML: false, // HTML 사용 안함
        allowOverlap: false, // 겹침 허용하지 않음
        step: 1,
        y: 3,
        x: -20, // 레이블을 왼쪽으로 약간 이동
        style: {
          fontSize: "13px",
        },
      },
      lineWidth: 0,
      gridLineWidth: 0,
    },
    yAxis: {
      min: 0,
      max: 100, // y축 최대값 설정
      tickInterval: 25, // y축 레이블 간격을 25점으로 설정
      title: { text: "", align: "high" },
      labels: { format: "{value} 점" },
      gridLineWidth: 5,
      lineWidth: 1,
    },
    plotOptions: {
      column: {
        stacking: "normal",
        borderWidth: 0,
        pointPadding: 0,
        groupPadding: 0.15,
        borderRadius: 10, // 숫자로 수정
        dataLabels: {
          enabled: false, // 데이터 레이블 비활성화
        },
      },
    },
    series: chartData.series,
    legend: {
      layout: "horizontal",
      align: "center",
      verticalAlign: "bottom",
      floating: false,
      backgroundColor: "#FFFFFF",
      shadow: true,
      itemStyle: {
        fontSize: "13px",
      },
      symbolRadius: 6, // 범례 심볼을 원으로 만들기 위해 사용
      symbolHeight: 12,
      symbolWidth: 12,
      symbolPadding: 10,
    },
    accessibility: {
      enabled: true,
    },
    exporting: {
      enabled: false,
    },
    credits: {
      enabled: false,
    },
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
