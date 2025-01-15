// src/components/Chart/Chart.jsx

import React, { useEffect } from 'react';
import Highcharts from 'highcharts';
import Exporting from 'highcharts/modules/exporting';
import ExportData from 'highcharts/modules/export-data';
import Accessibility from 'highcharts/modules/accessibility';
import './Chart.css';

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
    // 원래 animate 함수(초기 애니메이션용)를 저장합니다.
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
                opacity: 1
              })
              .animate(
                {
                  start: args.start,
                  end: args.end
                },
                {
                  duration: animation.duration / points.length
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
                        points.forEach(p => {
                          p.opacity = 1;
                        });
                        series.update({ enableMouseTracking: true }, false);
                        chart.update({
                          plotOptions: {
                            pie: {
                              innerSize: '40%',
                              borderRadius: 8
                            }
                          }
                        });
                      }
                    );
                  }
                }
              );
          }
        }
  
        if (init) {
          points.forEach(point => (point.opacity = 0));
        } else {
          fanAnimate(points[0], startAngleRad);
        }
      };
    })(Highcharts);
  
    // 차트 생성
    const chart = Highcharts.chart('chart-container', {
      chart: {
        type: 'pie',
        backgroundColor: 'transparent',
        // 1) 여기서 reflow를 true로 바꿔주세요.
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
                textAlign: 'center'
              })
              .attr({ align: 'center' })
              .add()
              .toFront();
            
            // 최초 로드 후에는 애니메이션 함수를 비워서 재호출되지 않도록 함
            Highcharts.seriesTypes.pie.prototype.animate = function () {};
          }
        }
      },
      title: { text: '' },
      subtitle: { text: '' },
      tooltip: {
        headerFormat: '',
        pointFormat:
          '<span style="color:{point.color}">\u25cf</span> {point.name}: <b>{point.percentage:.1f}%</b>'
      },
      accessibility: { point: { valueSuffix: '%' } },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          borderWidth: 2,
          cursor: 'pointer',
          dataLabels: {
            enabled: true,
            format: '<b>{point.name}</b><br>{point.percentage}%',
            distance: 20
          },
          point: {
            events: {
              click: function() {
                if (onSliceClick) {
                  onSliceClick(this.name);
                }
                this.series.points.forEach(pt => {
                  pt.graphic.attr({ opacity: pt === this ? 1 : 0.3 });
                });
              }
            }
          }
        }
      },
      exporting: { enabled: false },
      credits: { enabled: false },
      series: [
        {
          enableMouseTracking: false,
          animation: { duration: 2000 },
          colorByPoint: true,
          data: [
            { name: 'CLEAN', y: 21.3, color: '#9E9E9E' },
            { name: 'OPTIMIZE', y: 18.7, color: '#4CAF50' },
            { name: 'NEWBIE', y: 20.2, color: '#2196F3' },
            { name: 'STUDY', y: 14.2, color: '#FFC107' },
            { name: 'BASIC', y: 25.6, color: '#FF5722' }
          ]
        }
      ]
    });
  }, []);

  return (
    <div className="chart-wrapper">
      <div className="chart-inner">
        <div id="chart-container"></div>
      </div>
    </div>
  );
};

export default Chart;
