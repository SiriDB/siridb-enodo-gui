import "chartjs-adapter-moment";
import Chart from "chart.js/auto";
import { useState, useRef, useEffect, useCallback } from "react";

const LineChart = ({ datasets, labels, timeunit, output }) => {
  const [myChart, setMyChart] = useState(null);

  const canvasRef = useRef(null);

  const inOutput = useCallback(
    (timestamp) => {
      const res = output.find((v) => v[0] === timestamp);
      return res;
    },
    [output]
  );

  const customBackgroundColor = useCallback(
    (context) => {
      let label = context.parsed.x;
      return inOutput(label) ? "#d32f2f" : "rgba(0,0,0,0)";
    },
    [inOutput]
  );

  const customRadius = useCallback(
    (context) => {
      let label = context.parsed.x;
      return inOutput(label) ? 5 : 10;
    },
    [inOutput]
  );

  const footer = useCallback(
    (context) => {
      if (context && context[0].parsed) {
        let label = context[0].parsed.x;
        const op = inOutput(label);
        return op && typeof op[1] === "string" ? op[1] : null;
      }
      return null;
    },
    [inOutput]
  );

  useEffect(() => {
    if (myChart) {
      let newChart = myChart;
      newChart.data.labels = labels;
      newChart.data.datasets = datasets;
      newChart.options.scales.xAxis.time.unit = timeunit;
      newChart.options.animation.duration = 0; // general animation time
      newChart.update();
      setMyChart(newChart);
    } else {
      const newChart = new Chart(canvasRef.current, {
        type: "line",
        data: {
          labels: labels,
          datasets: datasets,
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: "top",
            },
            tooltip: {
              callbacks: {
                footer: footer,
              },
            },
          },
          scales: {
            xAxis: {
              ticks: {
                maxTicksLimit: 20,
              },
              type: "time",
              time: {
                unit: timeunit,
              },
            },
          },
          elements: {
            point: {
              borderWidth: 0,
              radius: customRadius,
              backgroundColor: customBackgroundColor,
            },
          },
        },
      });
      setMyChart(newChart);
    }
  }, [
    datasets,
    labels,
    myChart,
    timeunit,
    customBackgroundColor,
    customRadius,
    footer,
  ]);

  return <canvas ref={canvasRef} />;
};

export default LineChart;
