// src/components/RadialBarChart/RadialBarChart.jsx

import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Highcharts from "highcharts";
import DrilldownModule from "highcharts/modules/drilldown";
import ExportingModule from "highcharts/modules/exporting";
import ExportDataModule from "highcharts/modules/export-data";
import AccessibilityModule from "highcharts/modules/accessibility";
import HighchartsReact from "highcharts-react-official";
import styled from "styled-components";
import { getSelectedPRReviews } from "../../services/prReviewService";

// Highcharts 모듈 초기화
if (DrilldownModule && typeof DrilldownModule === "function") {
  DrilldownModule(Highcharts);
  console.log("Drilldown module initialized");
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

// 등급을 숫자로 매핑하는 객체
const gradeToScore = { S: 100, A: 80, B: 60, C: 40, D: 20 };

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
  min-width: 524px;
  max-width: 800px;
  min-height: 600px;
  margin: 2em auto;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  overflow: visible; /* 레이블이 잘리지 않도록 설정 */
`;

// 설명 스타일링
const Description = styled.p`
  margin: 0.3rem 10px;
  font-size: 1em;
  color: #555;
`;

const RadialBarChart = ({ selectedPrIds }) => {
  const [chartOptions, setChartOptions] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 데이터 변환 함수
  const transformData = (prReviews) => {
    // 카테고리별 PR 그룹화
    const categoryMap = {};

    prReviews.forEach((pr) => {
      const category = pr.category;
      const grade = gradeToScore[pr.aver_grade.toUpperCase()] || 0;

      if (!categoryMap[category]) {
        categoryMap[category] = {
          totalGrade: 0,
          count: 0,
          prs: [],
        };
      }

      categoryMap[category].totalGrade += grade;
      categoryMap[category].count += 1;
      categoryMap[category].prs.push(pr);
    });

    // 메인 시리즈 데이터와 드릴다운 시리즈 데이터 준비
    const mainSeriesData = [];
    const drilldownSeries = [];

    Object.keys(categoryMap).forEach((category) => {
      const { totalGrade, count, prs } = categoryMap[category];
      const averageGrade = totalGrade / count;

      mainSeriesData.push({
        name: category,
        y: averageGrade,
        drilldown: prs.length > 0 ? category : null,
        color: categoryColorMap[category] || "#000000",
      });

      if (prs.length > 0) {
        const drilldownData = prs.map((pr) => [
          pr.title,
          gradeToScore[pr.aver_grade.toUpperCase()] || 0,
        ]);

        drilldownSeries.push({
          name: category,
          id: category,
          data: drilldownData,
        });
      }
    });

    return { mainSeriesData, drilldownSeries };
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!selectedPrIds || selectedPrIds.length === 0) {
        setError("선택된 PR ID가 없습니다.");
        setChartOptions(null);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const response = await getSelectedPRReviews(selectedPrIds);

        if (!response || !response.data || !Array.isArray(response.data)) {
          setError("유효하지 않은 데이터 형식입니다.");
          setChartOptions(null);
          return;
        }

        const prReviews = response.data;

        if (prReviews.length === 0) {
          setError("표시할 PR 리뷰가 없습니다.");
          setChartOptions(null);
          return;
        }

        const { mainSeriesData, drilldownSeries } = transformData(prReviews);

        // Highcharts 옵션 설정
        const options = {
          chart: {
            type: "column",
            height: 600,
            backgroundColor: "#FFFFFF",
            marginLeft: 70,
          },
          title: {
            text: "",
          },
          subtitle: {
            text:
              "",
          },
          accessibility: {
            announceNewData: {
              enabled: true,
            },
          },
          xAxis: {
            type: "category",
            labels: {
              style: {
                fontSize: "13px",
              },
              formatter: function () {
                const category = this.value;
                const color = categoryColorMap[category] || "#000000";
                return `<span style="color:${color};">${category}</span>`;
              },
              useHTML: true, // HTML 형식을 사용하여 스타일 적용
            },
          },
          yAxis: {
            title: {
              text: "",
            },
            labels: {
              format: "{value} 점",
            },
            min: 0,
            max: 100,
            tickInterval: 20,
            gridLineWidth: 1,
            lineWidth: 1,
          },
          legend: {
            enabled: false,
          },
          plotOptions: {
            series: {
              borderWidth: 0,
              dataLabels: {
                enabled: false, // 데이터 레이블 비활성화
              },
              borderRadius: 25, // 막대의 모서리를 둥글게 설정 (원하는 값으로 조정 가능)
            },
            column: {
              colorByPoint: true,
            },
          },
          tooltip: {
            headerFormat: "<span style='font-size:11px'>{series.name}</span><br>",
            pointFormat:
              "<span style='color:{point.color}'>{point.name}</span>: <b>{point.y:.2f} 점</b><br/>",
          },
          exporting: {
            enabled: false, // 다운로드 버튼 비활성화
          },
          series: [
            {
              name: "카테고리",
              colorByPoint: true,
              data: mainSeriesData,
            },
          ],
          drilldown: {
            breadcrumbs: {
              position: {
                align: "right",
              },
            },
            series: drilldownSeries,
          },
        };

        setChartOptions(options);
      } catch (err) {
        console.error("데이터 가져오기 에러:", err);
        setError("데이터를 가져오는 중 오류가 발생했습니다.");
        setChartOptions(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedPrIds]);

  if (loading) {
    return (
      <ChartContainer>
        <p>로딩 중...</p>
      </ChartContainer>
    );
  }

  if (error) {
    return (
      <ChartContainer>
        <p style={{ color: "red" }}>⚠️ {error}</p>
      </ChartContainer>
    );
  }

  if (!chartOptions) {
    return null;
  }

  return (
    <ChartContainer>
      <HighchartsReact highcharts={Highcharts} options={chartOptions} />
      <Description>
      </Description>
    </ChartContainer>
  );
};

RadialBarChart.propTypes = {
  selectedPrIds: PropTypes.arrayOf(PropTypes.number).isRequired,
};

export default RadialBarChart;
