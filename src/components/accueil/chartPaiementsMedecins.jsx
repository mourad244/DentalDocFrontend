import React from "react";
import { Bar } from "react-chartjs-2";
function ChartPaiementsMedecins(props) {
  let { paiementsMedecin } = props;
  let sorted = [];
  paiementsMedecin.map((e) => sorted.push(e.x));
  // sort by order of attribute x in paiementsMedecin

  const options = {
    reponsive: true,
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
    labels: sorted,

    datasets: [
      {
        label: "Prothèses",
        data: paiementsMedecin,
        parsing: {
          yAxisKey: "paiements.Prothèses",
        },
        backgroundColor: ["#C84B31"],
        // borderColor: "red",
        // borderWidth: 2,
        // barThickness: 12,
      },
      {
        // label: "Anciens Patients",
        label: "Soins",

        data: paiementsMedecin,
        parsing: {
          yAxisKey: "paiements.Soins",
        },
        backgroundColor: ["#FFBF46"],
        // borderColor: "red",
        // borderWidth: 2,
        // barThickness: 12,
      },
      {
        // label: "Anciens Patients",
        label: "Ouverture",

        data: paiementsMedecin,
        parsing: {
          yAxisKey: "paiements.Ouverture",
        },
        backgroundColor: ["#8ACB88"],
        // borderColor: "red",
        // borderWidth: 2,
        // barThickness: 12,
      },
      // {
      //   label: "Nouveaux Patients",
      //   data: paiementsMedecin,
      //   parsing: {
      //     yAxisKey: "totalNouveauPatients",
      //   },
      //   backgroundColor: ["#8ACB88"],
      //   barThickness: 12,
      // },
    ],
  };
  return (
    <Bar
      data={data}
      options={options}
      // width={400}
      // options={{
      //   maintainAspectRatio: false,
      //   scales: {
      //     y: {
      //       beginAtZero: true,
      //     },
      //   },
      // }}
      // options={{
      //   layout: {
      //     padding: 20,
      //   },
      // }}
    />
  );
}

export default ChartPaiementsMedecins;
