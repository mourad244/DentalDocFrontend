import React from "react";
import { Pie } from "react-chartjs-2";

function ChartAdherencePatients(props) {
  let { nombrePatients, adherences } = props;
  // nombrePatients = [300, 50, 100, 250];
  // adherences = ["Adherent", "Famille Adherent", "Non Adherent", "Conventionné"];
  return (
    <Pie
      data={{
        labels: adherences,
        datasets: [
          {
            data: nombrePatients,
            backgroundColor: ["#FFBF46", "#575761", "#648381", "#8ACB88"],
            hoverOffset: 4,
          },
        ],
      }}
      options={{
        plugins: {
          legend: {
            labels: {
              font: {
                size: 14,
                family: "Roboto",
                weight: "bold",
              },
            },
          },
        },
      }}
    />
  );
}
export default ChartAdherencePatients;
