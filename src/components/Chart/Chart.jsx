import React, { useEffect } from 'react';
import styled from 'styled-components';
import Highcharts from 'highcharts';
import Exporting from 'highcharts/modules/exporting';
import ExportData from 'highcharts/modules/export-data';
import Accessibility from 'highcharts/modules/accessibility';

// styled-components로 변환
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
if (Exporting && typeof Exporting === 'function') {
  Exporting(Highcharts);
}
if (ExportData && typeof ExportData === 'function') {
  ExportData(Highcharts);
}
if (Accessibility && typeof Accessibility === 'function') {
  Accessibility(Highcharts);
}

const Chart = ({ onSliceClick, selectedMode }) => {
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
                              innerSize: '40%',
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

    const chart = Highcharts.chart('chart-container', {
      chart: {
        type: 'pie',
        backgroundColor: 'transparent',
        reflow: true,
        events: {
          load: function () {
            const chart = this;
            chart.renderer
              .label(
                'Total<br>42',
                chart.plotLeft + chart.plotWidth / 2,
                chart.plotTop + chart.plotHeight / 2 - 30,
                null,
                null,
                null,
                true
              )
              .css({
                color: '#000',
                fontSize: '24px',
                fontWeight: 'bold',
                textAlign: 'center',
              })
              .attr({ align: 'center' })
              .add()
              .toFront();

            Highcharts.seriesTypes.pie.prototype.animate = function () {};
          },
        },
      },
      title: { text: '' },
      subtitle: { text: '' },
      tooltip: {
        headerFormat: '',
        pointFormat:
          '<span style="color:{point.color}">●</span> {point.name}: <b>{point.percentage:.1f}%</b>',
      },
      accessibility: { 2: { valueSuffix: '%' } },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          borderWidth: 2,
          cursor: 'pointer',
          dataLabels: {
            enabled: true,
            format: '<b>{point.name}</b><br>{point.percentage}%',
            distance: 20,
          },
          point: {
            events: {
              click: function () {
                if (onSliceClick) {
                  onSliceClick(this.name);
                }
                const series = this.series;

                 // 클릭된 조각의 상태 확인
      if (this.isSelected) {
        // 이미 선택된 상태라면 모든 조각의 불투명도를 원래대로 복원
        series.points.forEach((point) => {
          point.graphic.css({ opacity: 1 });
          point.isSelected = false; // 상태 초기화
        });
      } else {
        // 선택되지 않은 상태라면 클릭된 조각 강조, 나머지 조각 흐리게
        series.points.forEach((point) => {
          if (point === this) {
            point.graphic.css({ opacity: 1 });
            point.isSelected = true; // 선택 상태 설정
          } else {
            point.graphic.css({ opacity: 0.3 });
                      point.isSelected = false; // 다른 조각은 선택 해제
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
            { name: 'CLEAN', y: 21.3, color: '#9E9E9E' },
            { name: 'OPTIMIZE', y: 18.7, color: '#4CAF50' },
            { name: 'NEWBIE', y: 20.2, color: '#2196F3' },
            { name: 'STUDY', y: 14.2, color: '#FFC107' },
            { name: 'BASIC', y: 25.6, color: '#FF5722' },
          ],
        },
      ],
    });
  }, []);

  return (
    <ChartWrapper>
      <ChartInner id="chart-container" />
    </ChartWrapper>
  );
};

export default Chart;