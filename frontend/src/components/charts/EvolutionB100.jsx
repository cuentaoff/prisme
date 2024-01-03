import ReactECharts from "echarts-for-react";
import moment from "moment/moment";
import React, { memo, useMemo } from "react";
import useChartTheme from "../../hooks/useChartTheme";

function EvolutionB100({ data }) {
  console.log("EvolutionB100", data);
  const theme = useChartTheme();
  const seriesNames = Object.keys(data[0]).filter((key) => key !== "seance");
  console.log("seriesNames EvolutionB100", seriesNames);
  const options = useMemo(() => {
    const seriesData = seriesNames
      .map((seriesName) => data.map((item) => item[seriesName]))
      .flat()
      .filter((value) => value !== undefined);
    const minYAxisValue = Math.min(...seriesData);
    console.log("minYAxisValue", minYAxisValue);

    return {
      title: {
        text: "Evolution base 100 des Portefeuille simulé",
        left: "center",
        ...theme.title,
      },
      grid: {
        right: "20%",
        top: "10%",
        // right: "3%",
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
      tooltip: {
        trigger: "axis",
        textStyle: {
          overflow: "breakAll",
          width: 40,
        },
        confine: true,
        valueFormatter: (value) => value.toFixed(2),
      },
      dataZoom: [
        {
          type: "slider", // Enable slider data zoom
          show: true,
          xAxisIndex: [0],
          start: 0,
          end: 100,
        },
        {
          type: "inside",
          xAxisIndex: [0],
          start: 0,
          end: 100,
        },
      ],
      xAxis: {
        type: "category",
        data: data.map((item) => moment(item.seance).format("DD/MM/YYYY")),
      },
      legend: {
        data: seriesNames,
        orient: "vertical",
        zLevel: 23,
        height: "50%",
        top: "center",
        right: 0,
        type: "scroll",
        textStyle: {
          width: 150,
          rich: {
            fw600: {
              fontWeight: 600,
            },
          },
        },
        formatter: function (name) {
          if (name.length > 25) {
            const newName = name.split(" ");
            return newName.join(" \n");
          }
          return name;
        },
        ...theme.legend,
      },
      yAxis: {
        type: "value",
        min: Math.trunc(minYAxisValue),
      },
      series: seriesNames.map((seriesName) => ({
        name: seriesName,
        type: "line",
        symbol: "none",
        data: data.map((item) => item[seriesName]),
      })),
    };
  }, [seriesNames, data, theme]);
  return (
    <ReactECharts
      option={options}
      style={{
        height: "500px",
        maxHeight: "600px",
      }}
    />
  );
}

export default memo(EvolutionB100);
