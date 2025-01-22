import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Highcharts from "highcharts";
import Exporting from "highcharts/modules/exporting";
import ExportData from "highcharts/modules/export-data";
import Accessibility from "highcharts/modules/accessibility";
import { fetchUserInfo, getPRReviewCategories } from "../../services/prReviewService"; // 사용자 정보 가져오기 API

const ChartWrapper = styled.div`
  width: 90%;
  height: 100%;
  padding: 30px;
  margin-right: 10px;
`;

const ChartInner = styled.div`
  width: 97%;
  height: 97%;
  margin-left: -120px;
  margin-top: 2px;
`;

// Highcharts modules
if (Exporting && typeof Exporting === "function") {
  Exporting(Highcharts);
}
if (ExportData && typeof ExportData === "function") {
  ExportData(Highcharts);
}
if (Accessibility && typeof Accessibility === "function") {
  Accessibility(Highcharts);
}

const Chart = ({ onSliceClick, selectedMode, isDarkMode }) => {
  const [statistics, setStatistics] = useState({
    basic: 0,
    newbie: 0,
    study: 0,
    optimize: 0,
    clean: 0,
  });
  const [userId, setUserId] = useState(null);  // 사용자 ID 상태 추가

  // 사용자 정보 가져오기
  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const userInfo = await fetchUserInfo();  // 사용자 정보 가져오기
        setUserId(userInfo.user_details.id);  // 사용자 ID 저장
      } catch (error) {
        console.error("사용자 정보 가져오기 실패:", error);
      }
    };

    fetchUserId();
  }, []);

  // 사용자 ID가 준비되면 PR 리뷰 데이터 가져오기
  useEffect(() => {
    const fetchChartData = async () => {
      if (!userId) return;  // userId가 없으면 데이터 로드하지 않음

      try {
        // userId를 기반으로 데이터 가져오기
        const response = await getPRReviewCategories(userId);
        setStatistics(response.statistics || {});
      } catch (error) {
        console.error("Chart 데이터 가져오기 에러:", error);
      }
    };

    fetchChartData();
  }, [userId]);

  useEffect(() => {
    const originalAnimate = Highcharts.seriesTypes.pie.prototype.animate;

    (function (H) {
      H.seriesTypes.pie.prototype.animate = function (init) {
        const series = this,
          chart = series.chart,
          points = series.points,
          { animation } = series.options,
          { startAngleRad } = series;

        function fanAnimate(point, startAngleRad) {
          const graphic = point.graphic,
            args = point.shapeArgs;

          if (graphic && args) {
            graphic
              .attr({
                start: startAngleRad,
                end: startAngleRad,
                opacity: 1,
              })
              .animate(
                {
                  start: args.start,
                  end: args.end,
                },
                {
                  duration: animation.duration / points.length,
                },
                function () {
                  if (points[point.index + 1]) {
                    fanAnimate(points[point.index + 1], args.end);
                  }
                  if (point.index === series.points.length - 1) {
                    series.dataLabelsGroup.animate(
                      { opacity: 1 },
                      void 0,
                      function () {
                        points.forEach((p) => {
                          p.opacity = 1;
                        });
                        series.update({ enableMouseTracking: true }, false);
                        chart.update({
                          plotOptions: {
                            pie: {
                              innerSize: "40%",
                              borderRadius: 8,
                            },
                          },
                        });
                      }
                    );
                  }
                }
              );
          }
        }

        if (init) {
          points.forEach((point) => (point.opacity = 0));
        } else {
          fanAnimate(points[0], startAngleRad);
        }
      };
    })(Highcharts);

    const chart = Highcharts.chart("chart-container", {
      chart: {
        type: "pie",
        backgroundColor: "transparent",
        reflow: true,
        events: {
          load: function () {
            const chart = this;
            chart.renderer
              .label(
                `Total<br>${Object.values(statistics).reduce(
                  (sum, val) => sum + val,
                  0
                )}`,
                chart.plotLeft + chart.plotWidth / 2,
                chart.plotTop + chart.plotHeight / 2 - 30,
                null,
                null,
                null,
                true
              )
              .css({
                color: isDarkMode ? "#FFFFFF" : "#000000",
                fontSize: "24px",
                fontWeight: "bold",
                textAlign: "center",
              })
              .attr({ align: "center" })
              .add()
              .toFront();
          },
        },
      },
      title: { text: "" },
      subtitle: { text: "" },
      tooltip: {
        headerFormat: "",
        pointFormat:
          "<span style=\"color:{point.color}\">●</span> {point.name}: <b>{point.percentage:.1f}%</b>",
      },
      accessibility: { 2: { valueSuffix: "%" } },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          borderWidth: 2,
          cursor: "pointer",
          dataLabels: {
            enabled: true,
            format: "<b>{point.name}</b><br>{point.percentage}%",
            distance: 20,
          },
          point: {
            events: {
              click: function () {
                if (onSliceClick) {
                  onSliceClick(this.name);
                }
                const series = this.series;

                if (this.isSelected) {
                  series.points.forEach((point) => {
                    point.graphic.css({ opacity: 1 });
                    point.isSelected = false;
                  });
                } else {
                  series.points.forEach((point) => {
                    if (point === this) {
                      point.graphic.css({ opacity: 1 });
                      point.isSelected = true;
                    } else {
                      point.graphic.css({ opacity: 0.3 });
                      point.isSelected = false;
                    }
                  });
                }
              },
            },
          },
        },
      },
      exporting: { enabled: false },
      credits: { enabled: false },
      series: [
        {
          enableMouseTracking: false,
          animation: { duration: 1200 },
          colorByPoint: true,
          data: [
            { name: "BASIC", y: statistics.basic, color: "#FF5722" },
            { name: "STUDY", y: statistics.study, color: "#FFC107" },
            { name: "NEWBIE", y: statistics.newbie, color: "#70BF73" },
            { name: "CLEAN", y: statistics.clean, color: "#4DABF5" },
            { name: "OPTIMIZE", y: statistics.optimize, color: "#BC6FCD" },
          ],
        },
      ],
    });

    return () => {
      chart.destroy();
    };
  }, [statistics, isDarkMode, userId]);  // userId를 의존성에 추가

  return (
    <ChartWrapper>
      <ChartInner id="chart-container" />
    </ChartWrapper>
  );
};

export default Chart;
