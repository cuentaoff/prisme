import React from "react";
import { useSelector } from "react-redux";

function useChartTheme() {
  const { darkTheme } = useSelector((state) => state.theme);
  const theme = {
    title: {
      textStyle: {
        color: darkTheme ? "white" : "black",
      },
    },
    legend: {
      textStyle: {
        color: darkTheme ? "white" : "black",
      },
    },
    xAxis: {
      nameTextStyle: {
        color: darkTheme ? "white" : "black",
      },
    },
    yAxis: {
      nameTextStyle: {
        color: darkTheme ? "white" : "black",
      },
    },
  };
  return theme;
}

export default useChartTheme;
