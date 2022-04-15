import Chart from "chart.js/auto";
import { useState, useRef, useEffect } from "react";
import 'chartjs-adapter-moment';

const LineChart = ({ datasets, labels, timeunit }) => {
  const [myChart, setMyChart] = useState(null);

  const canvasRef = useRef(null);

  useEffect(() => {
    if (myChart) {
      let newChart = myChart;
      newChart.data.labels = labels;
      newChart.data.datasets = datasets;
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
              radius: 10,
              backgroundColor: "rgba(0,0,0,0)",
            },
          },
        },
      });
      setMyChart(newChart);
    }
  }, [datasets, labels, myChart, timeunit]);

  return <canvas ref={canvasRef} />;
};

export default LineChart;
