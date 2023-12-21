import React from "react";
import { Bar } from "react-chartjs-2";
function ChartMedecinPatients(props) {
  let { medecinPatients } = props;
  // sort medecinPatients by order of attribute totalPatients in medecinPatients
  let sortedMedecins = [];
  medecinPatients.sort((a, b) => (a.totalPatients < b.totalPatients ? 1 : -1));
  medecinPatients.map((e) => sortedMedecins.push(e.x));
  const options = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          font: {
            size: 12,
            family: "Roboto",
            weight: "bold",
          },
        },
      },
    },
    scales: {
      x: {
        stacked: true,
        ticks: {
          autoSkip: false,
          font: {
            size: 12,
            weight: "bold",
          },
        },
      },
      y: {
        stacked: true,
        beginAtZero: true,
        // ticks: {
        //   stepSize: 1,
        // },
      },
    },
  };

  let data = {
    datasets: [
      {
        label: "FA",
        data: medecinPatients,
        parsing: {
          yAxisKey: "FA",
        },
        backgroundColor: ["#8ACB88"],
        // barThickness: 12,
      },
      {
        label: "A",
        data: medecinPatients,
        parsing: {
          yAxisKey: "A",
        },
        backgroundColor: ["#FFBD35"],
        // barThickness: 12,
      },
      {
        label: "NA",
        data: medecinPatients,
        parsing: {
          yAxisKey: "NA",
        },
        backgroundColor: ["#C84B31"],
        // barThickness: 12,
      },
    ],
    labels: sortedMedecins,
  };
  return <Bar data={data} options={options} />;
}

export default ChartMedecinPatients;
