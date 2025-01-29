// src/components/TreegraphChart/TreegraphChart.jsx

import React, { useEffect, useState } from "react";
import Highcharts from "highcharts";
import TreemapModule from "highcharts/modules/treemap";
import TreegraphModule from "highcharts/modules/treegraph";
import ExportingModule from "highcharts/modules/exporting";
import AccessibilityModule from "highcharts/modules/accessibility";
import HighchartsReact from "highcharts-react-official";
import styled from "styled-components";
import LoadingIndicator from "../LoadingIndicator/LoadingIndicator";
import { getSelectedPRReviews } from "../../services/prReviewService";
import PropTypes from "prop-types";

// Highcharts 모듈 초기화
if (TreemapModule && typeof TreemapModule === "function") {
  TreemapModule(Highcharts);
}
if (TreegraphModule && typeof TreegraphModule === "function") {
  TreegraphModule(Highcharts);
}
if (ExportingModule && typeof ExportingModule === "function") {
  ExportingModule(Highcharts);
}
if (AccessibilityModule && typeof AccessibilityModule === "function") {
  AccessibilityModule(Highcharts);
}

// 카테고리별 색상 매핑 (소문자 키 사용)
const categoryColorMap = {
  clean: "#4DABF5",
  optimize: "#BC6FCD",
  basic: "#FF794E",
  newbie: "#70BF73",
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
  
  textPath {
    display: none !important;
  }

  tspan.highcharts-text-outline {
    display: none !important;
  }
`;

const TreegraphChart = ({ selectedPrIds }) => {
  const [chartData, setChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("🔄 TreegraphChart: selectedPrIds 변경됨:", selectedPrIds);

    if (!selectedPrIds || selectedPrIds.length === 0) {
      setChartData([]);
      setIsLoading(false);
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await getSelectedPRReviews(selectedPrIds);
        console.log("📊 TreegraphChart API Response:", response);
        const prReviews = response.data;

        if (!prReviews || prReviews.length === 0) {
          setChartData([]);
          return;
        }

        // 데이터 변환 로직
        const transformedData = transformData(prReviews);
        console.log("📊 TreegraphChart Transformed Data:", transformedData);
        setChartData(transformedData);
      } catch (err) {
        console.error("📊 TreegraphChart Error fetching selected PR reviews:", err);
        setError("PR 리뷰 데이터를 불러오는 데 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedPrIds]);

  // 데이터 변환 함수
  const transformData = (prReviews) => {
    // Root node
    const data = [
      {
        id: "0.0",
        parent: "",
        name: "Report Name", // 보고서 이름 (동적으로 설정 가능)
      },
    ];

    // Group PR reviews by category (mode)
    const categoryMap = {};
    prReviews.forEach((pr) => {
      const category = pr.category.toLowerCase() || "unknown category"; // 소문자로 변환
      if (!categoryMap[category]) {
        categoryMap[category] = [];
      }
      // Add unique problem types, max 4 per category
      if (
        !categoryMap[category].includes(pr.problem_type) &&
        categoryMap[category].length < 4
      ) {
        categoryMap[category].push(pr.problem_type);
      }
    });

    // Collect child node colors
    const childColors = [];

    // Assign unique IDs for categories and problem types
    let categoryIndex = 1;
    Object.keys(categoryMap).forEach((category) => {
      const categoryId = `1.${categoryIndex}`;
      const categoryColor = categoryColorMap[category] || "#CCCCCC"; // 기본 색상 할당
      data.push({
        id: categoryId,
        parent: "0.0",
        name: category.charAt(0).toUpperCase() + category.slice(1), // 첫 글자 대문자
        color: categoryColor,
      });

      categoryMap[category].forEach((problemType, pIndex) => {
        const problemId = `2.${categoryIndex}.${pIndex}`;
        data.push({
          id: problemId,
          parent: categoryId,
          name: problemType,
          color: categoryColor, // 자식 노드에도 부모 카테고리 색상 할당
        });
        childColors.push(categoryColor);
      });

      categoryIndex++;
    });

    // Create gradient color based on childColors
    if (childColors.length > 0) {
      // Remove duplicates
      const uniqueColors = [...new Set(childColors)];
      let gradient;
      if (uniqueColors.length === 1) {
        // Single color, use it directly
        gradient = uniqueColors[0];
      } else {
        // Multiple colors, create a linear gradient
        gradient = {
          linearGradient: { x1: 0, y1: 0, x2: 1, y2: 0 },
          stops: uniqueColors.map((color, index) => [
            index / (uniqueColors.length - 1),
            color,
          ]),
        };
      }

      // Update root node's color with gradient
      const rootNode = data.find((node) => node.id === "0.0");
      if (rootNode) {
        rootNode.color = gradient;
      }
    }

    return data;
  };

  // Highcharts 옵션 설정
  const chartOptions = {
    chart: {
      type: "treegraph",
      backgroundColor: "#ffffff",
      marginTop: 100,
      events: {
        render: function () {
          const chart = this;
          // 모든 textPath 요소 제거
          chart.container.querySelectorAll("textPath").forEach((el) => el.remove());
        },
      },
    },
    title: {
      text: "",
    },
    tooltip: {
      formatter: function () {
        // 호버된 포인트의 속성 출력 (디버깅용)
        console.log("Hovered point:", this.point);

        // 연결선 포인트 식별 조건
        // 'from'과 'to' 속성이 있는 경우 툴팁을 표시하지 않음
        if (this.point && this.point.from && this.point.to) {
          return null; // 연결선 툴팁 숨김
        }

        return this.point.name; // 노드 툴팁 표시
      },
      useHTML: true,
      style: {
        pointerEvents: "none", // 툴팁이 마우스 이벤트를 받지 않도록 설정
      },
    },
    series: [
      {
        type: "treegraph",
        data: chartData,
        marker: {
          symbol: "rect",
          width: "25%",
        },
        borderRadius: 10,
        dataLabels: {
          format: "{point.name}",
          style: {
            whiteSpace: "nowrap",
          },
        },
        linkLabels: {
          enabled: false, // 연결선 레이블 비활성화
        },
        levels: [
          {
            level: 1,
            levelIsConstant: false,
          },
          {
            level: 2,
            colorByPoint: true,
          },
          {
            level: 3,
            colorVariation: {
              key: "brightness",
              to: -0.5,
            },
          },
          {
            level: 4,
            colorVariation: {
              key: "brightness",
              to: 0.5,
            },
          },
        ],
      },
    ],
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

  // Treegraph 시리즈 타입이 제대로 로드되었는지 확인
  useEffect(() => {
    console.log("Treegraph series type:", Highcharts.seriesTypes.treegraph);
  }, []);

  return (
    <ChartContainer>
      {isLoading ? (
        <LoadingIndicator />
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : chartData.length === 0 ? (
        <p>No PR Reviews Selected.</p>
      ) : (
        <HighchartsReact highcharts={Highcharts} options={chartOptions} />
      )}
    </ChartContainer>
  );
};

TreegraphChart.propTypes = {
  selectedPrIds: PropTypes.arrayOf(PropTypes.number).isRequired,
};

export default TreegraphChart;

