import * as React from "react";
import { PieChart, pieArcLabelClasses } from "@mui/x-charts/PieChart";
import "./pieChart.css";

export const PieChartMonth = ({ dataDB }) => {
  const valueFormat = (item) => `${item.value}`;

  const getCurrentMonth = () => {
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, 0); // Pega o mês atual

    const year = now.getFullYear(); // Pega o ano atual

    return `${month}/${year}`;
  };

  const processData = (dataDB) => {
    const currentMonth = getCurrentMonth();

    // Filtra os trabalhos pelo mês atual
    const filteredData = dataDB.filter(({ date }) =>
      date.endsWith(currentMonth)
    );

    // Contabiliza a frequência de cada tipo de trabalho
    const workCount = filteredData.reduce((acc, { work }) => {
      acc[work] = (acc[work] || 0) + 1;
      return acc;
    }, {});

    // Calcula o total de trabalhos para o mês atual
    const totalWorks = filteredData.length;

    const chartData = Object.keys(workCount).map((work) => ({
      label: work,
      value: Number(((workCount[work] / totalWorks) * 100).toFixed(2)), // Porcentagem
    }));

    return chartData;
  };

  const chartData = processData(dataDB);

  return (
    <section className="chartPie">
      <h3>Trabalhos por área no mês atual</h3>
      <div className="pie">
        <PieChart
          series={[
            {
              arcLabel: (item) => `${item.value}%`,
              arcLabelMinAngle: 35,
              arcLabelRadius: "60%",
              data: chartData,
              valueFormat,
              highlightScope: { faded: "global", highlighted: "item" },
              faded: { innerRadius: 30, additionalRadius: -30, color: "gray" },
            },
          ]}
          sx={{
            [`& .${pieArcLabelClasses.root}`]: {
              fontWeight: "bold",
              fontSize: "12px",
            },
          }}
          {...size}
        />
      </div>
    </section>
  );
};

const size = {
  width: 580,
  height: 200,
};
