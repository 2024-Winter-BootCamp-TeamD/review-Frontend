// src/components/WordcloudChart/WordcloudChart.jsx

import React, { useEffect, useState } from "react";
import Highcharts from "highcharts";
import WordcloudModule from "highcharts/modules/wordcloud";
import ExportingModule from "highcharts/modules/exporting";
import ExportDataModule from "highcharts/modules/export-data";
import AccessibilityModule from "highcharts/modules/accessibility";
import HighchartsReact from "highcharts-react-official";
import styled from "styled-components";
import LoadingIndicator from "../LoadingIndicator/LoadingIndicator"; // 로딩 인디케이터 컴포넌트 임포트
import { getSelectedPRReviews } from "../../services/prReviewService"; // PR 리뷰 데이터를 가져오는 함수 임포트

// Highcharts 모듈 초기화
if (WordcloudModule && typeof WordcloudModule === "function") {
  WordcloudModule(Highcharts);
  console.log("WordcloudModule initialized");
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

// PRREVIEW_IDS를 컴포넌트 외부에 정의
const PRREVIEW_IDS = [1, 2, 3, 4, 5, 6];

// 차트 컨테이너 스타일링
const ChartWrapper = styled.div`
  width: 800px;
  max-width: 100%;
  height: 600px;
  background-color: #ffffff; /* 배경색 설정 */
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
`;

const WordcloudChart = () => {
  const [chartOptions, setChartOptions] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPRReviews = async () => {
      try {
        // PR 리뷰 데이터 가져오기
        const response = await getSelectedPRReviews(PRREVIEW_IDS);
        console.log("API Response:", response);

        const prReviews = response.data;

        if (!prReviews || prReviews.length === 0) {
          setChartOptions({});
          setIsLoading(false);
          return;
        }

        // 데이터 처리: aver_grade, problem_type, category, created_at를 텍스트로 변환
        const textArray = prReviews.flatMap((pr) => [
          pr.aver_grade,
          pr.problem_type,
          pr.category,
          new Date(pr.created_at).toLocaleDateString("en-US"), // 날짜를 읽기 쉬운 형식으로 변환
        ]);

        const text = textArray.join(" ");

        console.log("Combined Text:", text);

        // 단어 분리 및 빈도 계산
        const words = text.replace(/[():'?0-9]+/g, "").split(/[,\. ]+/g);
        const data = words.reduce((arr, word) => {
          if (!word) return arr; // 빈 문자열 건너뛰기
          const lowerWord = word.toLowerCase();
          let obj = Highcharts.find(arr, (obj) => obj.name === lowerWord);
          if (obj) {
            obj.weight += 1;
          } else {
            obj = {
              name: lowerWord,
              weight: 1,
            };
            arr.push(obj);
          }
          return arr;
        }, []);

        console.log("Word Frequencies:", data);

        // Highcharts 옵션 설정
        const options = {
          accessibility: {
            screenReaderSection: {
              beforeChartFormat:
                '<h5>{chartTitle}</h5>' +
                '<div>{chartSubtitle}</div>' +
                '<div>{chartLongdesc}</div>' +
                '<div>{viewTableButton}</div>',
            },
          },
          series: [
            {
              type: "wordcloud",
              data,
              name: "Occurrences",
            },
          ],
          title: {
            text: "Wordcloud of Selected PR Reviews",
            align: "left",
            style: {
              color: "#000000",
            },
          },
          subtitle: {
            text: "Based on aver_grade, problem_type, category, created_at",
            align: "left",
            style: {
              color: "#000000",
            },
          },
          tooltip: {
            headerFormat:
              '<span style="font-size: 16px"><b>{point.name}</b></span><br>',
          },
          exporting: {
            enabled: true, // 내보내기 기능 활성화
          },
          credits: {
            enabled: false,
          },
        };

        // 옵션 설정 후 상태 업데이트
        setChartOptions(options);
        setIsLoading(false);
      } catch (err) {
        console.error("Word Cloud 차트 로딩 실패:", err);
        setError("Word Cloud 차트를 불러오는 데 실패했습니다.");
        setIsLoading(false);
      }
    };

    fetchPRReviews();
  }, []); // 의존성 배열을 빈 배열로 설정하여 컴포넌트 마운트 시 한 번만 호출

  return (
    <ChartWrapper>
      {isLoading ? (
        <LoadingIndicator />
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : chartOptions.series ? (
        <HighchartsReact highcharts={Highcharts} options={chartOptions} />
      ) : (
        <p>No Data Available for Word Cloud.</p>
      )}
    </ChartWrapper>
  );
};

export default WordcloudChart;
