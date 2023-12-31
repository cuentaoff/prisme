import React, { memo, useMemo } from "react";
import ReactECharts from "echarts-for-react";
import useChartTheme from "../../../hooks/useChartTheme";

const EoyChart = ({ data }) => {
  const theme = useChartTheme();
  console.log("render EoyChart");
  const years = useMemo(() => data.map((item) => item.Year), [data]);
  const seriesName = useMemo(
    () => Object.keys(data[0]).filter((key) => key !== "Year" && key !== "Won"),
    [data]
  );
  const series = useMemo(
    () =>
      seriesName.map((key) => ({
        name: key,
        type: "bar",
        data: data.map((item) => item[key] * 100),
      })),
    [data, seriesName]
  );
  const options = useMemo(() => {
    return {
      title: {
        text: "EOY Returns vs Benchmark vs Bench_cat",
        left: "center",
        ...theme.title,
      },
      tooltip: {
        trigger: "axis",
        confine: true,
        valueFormatter: (value) => value?.toFixed(2),
      },
      legend: {
        data: seriesName,
        orient: "horizontal",
        zLevel: 23,
        width: "60%",
        left: "center",
        bottom: "9%",
        type: "scroll",
        ...theme.legend,
      },
      grid: {
        right: "5%",
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
        data: years,
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
    };
  }, [series, seriesName, years, theme]);
  return (
    <ReactECharts
      option={options}
      style={{
        minHeight: 500,
        margin: "15px 0",
      }}
    />
  );
};

export default memo(EoyChart);
