import React, { memo, useMemo } from "react";
import ReactECharts from "echarts-for-react";
import useChartTheme from "../../../hooks/useChartTheme";
import { defaultOptions } from "../../../utils/chart/defaultOptions";

const DailyReturns = ({ data }) => {
  console.log("render DailyReturns");
  const theme = useChartTheme();
  const seriesName = useMemo(
    () => Object.keys(data[0]).filter((key) => key !== "seance"),
    [data]
  );
  const series = useMemo(
    () =>
      seriesName.map((key) => ({
        name: key,
        type: "bar",
        data: data.map((item) => ({
          value: item[key],
          itemStyle: {
            color: item[key] < 0 ? "#ee4658" : "#21cc6d",
          },
        })),
      })),
    [seriesName, data]
  );
  const options = useMemo(() => {
    return {
      title: {
        text: "Returns",
        left: "center",
        ...theme.title,
      },
      tooltip: {
        trigger: "axis",
        confine: true,
        valueFormatter: (value) => value?.toFixed(2),
      },
      legend: {
        show: false,
        data: seriesName,
        orient: "vertical",
        zLevel: 23,
        height: "50%",
        top: "center",
        right: 0,
        type: "scroll",
        ...theme.legend,
      },
      grid: {
        right: "100px",
        top: "10%",
        bottom: "15%",
        containLabel: true,
      },
      toolbox: {
        feature: {
          dataZoom: {
            yAxisIndex: true,
          },
          restore: {},
          saveAsImage: {},
        },
        top: "20px",
      },
      xAxis: {
        type: "category",
        data: data.map((item) => item.seance),
        axisLabel: {
          ...theme.xAxis.nameTextStyle,
        },
        ...theme.xAxis,
      },
      yAxis: {
        type: "value",
        axisLabel: {
          ...theme.yAxis.nameTextStyle,
        },
        ...theme.yAxis,
      },
      series: series,
      ...defaultOptions,
    };
  }, [theme, defaultOptions, series, seriesName]);
  return (
    <ReactECharts
      option={options}
      style={{
        minHeight: 500,
      }}
    />
  );
};

export default memo(DailyReturns);
