import React, { useState, useEffect, useRef } from "react";
import Chartjs from "chart.js";
import SelectCountry from "./SelectCountry";

const url = "https://pomber.github.io/covid19/timeseries.json";

const Covid19 = () => {
  const [labels, setLabels] = useState([]);
  const [countries, setCountries] = useState(null);
  const [data, setData] = useState(null);
  const [myChart, setMyChart] = useState(null);

  const [country1, setCountry1] = useState(null);
  const [country2, setCountry2] = useState(null);
  const [country3, setCountry3] = useState(null);

  const chartContainer = useRef(null);

  const isRemovedDataset = (country) => {
    if (country) {
      const index = myChart.data.datasets.findIndex(
        (dataset) => dataset.label === country
      );
      if (index > -1) {
        myChart.data.datasets.splice(index, 1);
        return true;
      }
    }
    return false;
  };

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await fetch(url);
        const data = await response.json();
        // Labels
        const lb = [];
        data["Brazil"].forEach(({ date }) => {
          const dt = date.split("-");
          lb.push(dt[1].padStart(2, "0") + "/" + dt[2].padStart(2, "0"));
        });
        setLabels(lb);

        //Countrys
        setCountries(Object.keys(data).map((i) => i));

        //Data
        setData(data);
      } catch (error) {
        console.error("error", error);
      }
    };
    getData();
  }, []);

  useEffect(() => {
    if (chartContainer && chartContainer.current && data && labels) {
      setMyChart(
        new Chartjs(chartContainer.current, {
          type: "line",
          data: {
            labels: labels,
            datasets: [],
          },
          options: {
            animation: {
              duration: 2000, // general animation time
            },
            responsive: true,
            title: {
              display: true,
              text: "CONFIRMED CASES",
            },
          },
        })
      );
    }
  }, [chartContainer, data, labels]);

  const getSelectedCountry1 = (value) => {
    if (!value) {
      if (isRemovedDataset(country1)) myChart.update();
      return;
    }

    isRemovedDataset(country1);
    myChart.data.datasets.push({
      label: value,
      data: data[value].map((info) => info.confirmed),
      backgroundColor: ["rgba(245, 65, 65, 0.2)"],
      borderColor: ["rgba(245, 65, 65, 1)"],
      borderWidth: 1,
    });
    myChart.update();

    setCountry1(value);
  };

  const getSelectedCountry2 = (value) => {
    if (!value) {
      if (isRemovedDataset(country2)) myChart.update();
      return;
    }

    isRemovedDataset(country2);
    myChart.data.datasets.push({
      label: value,
      data: data[value].map((info) => info.confirmed),
      backgroundColor: ["rgba(65, 245, 65, 0.2)"],
      borderColor: ["rgba(65, 245, 65, 1)"],
      borderWidth: 1,
    });
    myChart.update();

    setCountry2(value);
  };

  const getSelectedCountry3 = (value) => {
    if (!value) {
      if (isRemovedDataset(country3)) myChart.update();
      return;
    }

    isRemovedDataset(country3);
    myChart.data.datasets.push({
      label: value,
      data: data[value].map((info) => info.confirmed),
      backgroundColor: ["rgba(65, 65, 245, 0.2)"],
      borderColor: ["rgba(65, 65, 245, 1)"],
      borderWidth: 1,
    });
    myChart.update();

    setCountry3(value);
  };

  if (!data) {
    return <h3>Loading...</h3>;
  }

  return (
    <div>
      <div>
        Country 1:
        <SelectCountry countries={countries} onSelect={getSelectedCountry1} />
        Country 2:
        <SelectCountry countries={countries} onSelect={getSelectedCountry2} />
        Country 3:
        <SelectCountry countries={countries} onSelect={getSelectedCountry3} />
      </div>
      <canvas id="myChart" ref={chartContainer} />
    </div>
  );
};

export default Covid19;
