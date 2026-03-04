import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

export default function ProgressChart({ chart, topicsMap }) {
  const safe = Array.isArray(chart) ? chart : [];

  // сортируем по убыванию прогресса и берем 6
  const top = [...safe]
    .sort((a, b) => (b.progress || 0) - (a.progress || 0))
    .slice(0, 6);

  const labels = top.map((x) => topicsMap?.[x.topicId]?.title || x.topicId);
  const values = top.map((x) => Number(x.progress || 0));

  const data = {
    labels,
    datasets: [{ data: values }]
  };

  const options = {
    responsive: true,
    indexAxis: "y",
    plugins: { legend: { display: false } },
    scales: {
      x: { min: 0, max: 100, ticks: { stepSize: 20 } }
    }
  };

  return <Bar data={data} options={options} />;
}