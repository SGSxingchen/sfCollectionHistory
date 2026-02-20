'use client';
import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

interface DataLineChartsProps {
  xData: string[];
  seriesData: any[];
  title: string;
  height?: number;
}

const DataLineCharts: React.FC<DataLineChartsProps> = ({
  xData,
  seriesData,
  title,
  height = 600,
}) => {
  const chartRef = useRef<HTMLDivElement | null>(null);
  const chartInstanceRef = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    // Dispose previous instance if exists
    if (chartInstanceRef.current) {
      chartInstanceRef.current.dispose();
    }

    const chartInstance = echarts.init(chartRef.current);
    chartInstanceRef.current = chartInstance;

    const options = {
      title: {
        text: title || 'Stacked Line',
        top: '0%',
      },
      tooltip: {
        trigger: 'axis',
      },
      legend: {
        data: seriesData.map((item) => item.name),
        top: '6%',
        left: 'center',
      },
      grid: {
        top: '15%',
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      toolbox: {
        feature: {
          saveAsImage: {},
        },
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: xData,
      },
      yAxis: {
        type: 'value',
      },
      series: seriesData,
    };

    chartInstance.setOption(options);

    // Handle resize via ResizeObserver (works in Tabs)
    const resizeObserver = new ResizeObserver(() => {
      chartInstance.resize();
    });
    resizeObserver.observe(chartRef.current);

    // Also handle window resize
    const handleResize = () => chartInstance.resize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      resizeObserver.disconnect();
      chartInstance.dispose();
      chartInstanceRef.current = null;
    };
  }, [xData, seriesData, title]);

  return <div ref={chartRef} style={{ width: '100%', height: `${height}px` }} />;
};

export default DataLineCharts;
