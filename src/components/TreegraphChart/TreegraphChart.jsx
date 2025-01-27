// src/components/TreegraphChart/TreegraphChart.jsx

import React, { useEffect, useState } from "react";
import Highcharts from "highcharts";
import TreemapModule from "highcharts/modules/treemap";
import TreegraphModule from "highcharts/modules/treegraph";
import ExportingModule from "highcharts/modules/exporting";
import AccessibilityModule from "highcharts/modules/accessibility";
import HighchartsReact from "highcharts-react-official";
import styled from "styled-components";
import LoadingIndicator from "../LoadingIndicator/LoadingIndicator"; // 로딩 인디케이터 컴포넌트 임포트
import { getSelectedPRReviews } from "../../services/prReviewService"; // PR 리뷰 데이터를 가져오는 함수 임포트

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

// prreviewIds를 컴포넌트 외부에 정의
const PRREVIEW_IDS = [1, 2, 3, 4, 5, 6];

// 차트 컨테이너 스타일링
const ChartWrapper = styled.div`
  width: 800px;
  max-width: 100%;
  height: 600px;
  background-color: #ffffff; /* 다크 모드 제거 */
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);

  /* 연결선 텍스트 숨기기 */
  textPath {
    display: none !important;
  }

  /* 추가적으로 textPath 내부의 tspan 숨기기 (필요 시) */
  tspan.highcharts-text-outline {
    display: none !important;
  }
`;

const TreegraphChart = () => {
  const [chartData, setChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await getSelectedPRReviews(PRREVIEW_IDS);
        console.log("API Response:", response);
        const prReviews = response.data;

        if (!prReviews || prReviews.length === 0) {
          setChartData([]);
          return;
        }

        // 데이터 변환 로직
        const transformedData = transformData(prReviews);
        console.log("Transformed Data:", transformedData);
        setChartData(transformedData);
      } catch (err) {
        console.error("Error fetching selected PR reviews:", err);
        setError("PR 리뷰 데이터를 불러오는 데 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []); // 의존성 배열을 빈 배열로 설정하여 컴포넌트 마운트 시 한 번만 호출

  // 데이터 변환 함수
  const transformData = (prReviews) => {
    // Root node
    const data = [
      {
        id: "0.0",
        parent: "",
        name: "demo", // 보고서 이름
      },
    ];

    // Group PR reviews by category (mode)
    const categoryMap = {};
    prReviews.forEach((pr) => {
      const category = pr.category || "Unknown Category";
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

    // Assign unique IDs for categories and problem types
    let categoryIndex = 1;
    Object.keys(categoryMap).forEach((category) => {
      const categoryId = `1.${categoryIndex}`;
      data.push({
        id: categoryId,
        parent: "0.0",
        name: category,
      });

      categoryMap[category].forEach((problemType, pIndex) => {
        const problemId = `2.${categoryIndex}.${pIndex}`;
        data.push({
          id: problemId,
          parent: categoryId,
          name: problemType,
        });
      });

      categoryIndex++;
    });

    return data;
  };

  // Highcharts 옵션 설정
  const chartOptions = {
    chart: {
      type: "treegraph",
      backgroundColor: "#ffffff",
      events: {
        render: function () {
          const chart = this;
          // 모든 textPath 요소 제거
          chart.container.querySelectorAll("textPath").forEach((el) => el.remove());
        },
      },
    },
    title: {
      text: "Treegraph with Box Layout",
      style: {
        color: "#000000",
      },
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
    <ChartWrapper>
      {isLoading ? (
        <LoadingIndicator />
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : chartData.length === 0 ? (
        <p>No PR Reviews Selected.</p>
      ) : (
        <HighchartsReact highcharts={Highcharts} options={chartOptions} />
      )}
    </ChartWrapper>
  );
};

export default TreegraphChart;
