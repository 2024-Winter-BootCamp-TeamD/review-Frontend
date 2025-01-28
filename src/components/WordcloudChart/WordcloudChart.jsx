// src/components/WordcloudChart/WordcloudChart.jsx

import React, { useEffect, useState } from "react";
import Highcharts from "highcharts";
import WordcloudModule from "highcharts/modules/wordcloud";
import ExportingModule from "highcharts/modules/exporting";
import ExportDataModule from "highcharts/modules/export-data";
import AccessibilityModule from "highcharts/modules/accessibility";
import HighchartsReact from "highcharts-react-official";
import styled from "styled-components";
import LoadingIndicator from "../LoadingIndicator/LoadingIndicator";
import { getSelectedPRReviews } from "../../services/prReviewService";
import PropTypes from "prop-types";

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

// 카테고리별 색상 매핑 (소문자 키 사용)
const categoryColorMap = {
  clean: "#4DABF5",
  optimize: "#BC6FCD",
  basic: "#FF794E",
  newbie: "#70BF73",
  study: "#FFCD39",
};

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

const WordcloudChart = ({ selectedPrIds }) => {
  const [chartOptions, setChartOptions] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("🔄 WordcloudChart: selectedPrIds 변경됨:", selectedPrIds);

    if (!selectedPrIds || selectedPrIds.length === 0) {
      setChartOptions({});
      setIsLoading(false);
      return;
    }

    const fetchPRReviews = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // PR 리뷰 데이터 가져오기
        const response = await getSelectedPRReviews(selectedPrIds);
        console.log("📊 WordcloudChart API Response:", response);
        const prReviews = response.data;

        if (!prReviews || prReviews.length === 0) {
          setChartOptions({});
          setIsLoading(false);
          return;
        }

        // 데이터 처리: aver_grade, problem_type, category를 텍스트로 변환 (created_at 제외)
        const textArray = prReviews.flatMap((pr) => [
          pr.aver_grade,
          pr.problem_type,
          pr.category.toLowerCase(), // 소문자로 변환
          // created_at은 제외
        ]);
        const text = textArray.join(" ");

        console.log("📊 WordcloudChart Combined Text:", text);

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
              // 카테고리에 해당하는 단어인지 확인하여 색상 할당
              color: categoryColorMap[lowerWord] || undefined,
            };
            arr.push(obj);
          }
          return arr;
        }, []);

        console.log("📊 WordcloudChart Word Frequencies:", data);

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
              // 추가적인 워드클라우드 설정 가능
            },
          ],
          title: {
            text: "",
          },
          subtitle: {
            text: "",
          },
          tooltip: {
            headerFormat:
              '<span style="font-size: 16px"><b>{point.name}</b></span><br>',
          },
          exporting: {
            enabled: false, // 내보내기 기능 비활성화
          },
          credits: {
            enabled: false,
          },
        };

        // 옵션 설정 후 상태 업데이트
        setChartOptions(options);
      } catch (err) {
        console.error("📊 WordcloudChart Error fetching PR reviews:", err);
        setError("Word Cloud 차트를 불러오는 데 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPRReviews();
  }, [selectedPrIds]);

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

WordcloudChart.propTypes = {
  selectedPrIds: PropTypes.arrayOf(PropTypes.number).isRequired,
};

export default WordcloudChart;
