import React, { useState, useEffect, useRef } from "react";
import Chartjs from "chart.js";
import SelectCountry from "../SelectCountry";
import style from "./style.module.css";

const url = "https://pomber.github.io/covid19/timeseries.json";

const DataType = { CASES: 1, DEATHS: 2 };

const Covid19 = () => {
  const [labels, setLabels] = useState([]);
  const [countries, setCountries] = useState(null);
  const [data, setData] = useState(null);
  const [myChart, setMyChart] = useState(null);
  const [dataType, setDataType] = useState(DataType.CASES);

  const [listCountry, setListCountry] = useState([
    {
      country: null,
      backgroundColor: ["rgba(245, 65, 65, 0.2)"],
      borderColor: ["rgba(245, 65, 65, 1)"],
    },
    {
      country: null,
      backgroundColor: ["rgba(65, 245, 65, 0.2)"],
      borderColor: ["rgba(65, 245, 65, 1)"],
    },
    {
      country: null,
      backgroundColor: ["rgba(65, 65, 245, 0.2)"],
      borderColor: ["rgba(65, 65, 245, 1)"],
    },
  ]);

  const chartContainer = useRef(null);

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
            maintainAspectRatio: false,
            animation: {
              duration: 2000, // general animation time
            },
            responsive: true,
          },
        })
      );
    }
  }, [chartContainer, data, labels]);

  useEffect(() => {
    if (myChart && data) {
      myChart.data.datasets.map((country) => {
        country.data = data[country.label].map((info) =>
          dataType === DataType.CASES ? info.confirmed : info.deaths
        );
        return country.data;
      });
      myChart.update();
    }
  }, [dataType, myChart, data]);

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

  const getSelectedCountry = (index, value) => {
    if (!value) {
      if (isRemovedDataset(listCountry[index].country)) myChart.update();
      return;
    }

    isRemovedDataset(listCountry[index].country);
    myChart.data.datasets.push({
      label: value,
      data: data[value].map((info) =>
        dataType === DataType.CASES ? info.confirmed : info.deaths
      ),
      backgroundColor: listCountry[index].backgroundColor,
      borderColor: listCountry[index].borderColor,
      borderWidth: 1,
    });
    myChart.update();

    listCountry[index].country = value;
    setListCountry([...listCountry]);
  };

  if (!data) {
    return <h3>Loading...</h3>;
  }

  return (
    <div>
      <div className={style.title}>COVID-19</div>
      <div className={style.header}>
        {listCountry.map((_, index) => (
          <div className={style.item} key={index}>
            <SelectCountry
              index={index}
              countries={countries}
              onSelect={getSelectedCountry}
            />
          </div>
        ))}
      </div>
      <div className={style.radioContainer}>
        <label className={style.radio}>
          <input
            type="radio"
            value={DataType.CASES}
            checked={dataType === DataType.CASES}
            onChange={() => setDataType(DataType.CASES)}
          />{" "}
          CASES
        </label>
        <label className={style.radio}>
          <input
            type="radio"
            value={DataType.DEATHS}
            checked={dataType === DataType.DEATHS}
            onChange={() => setDataType(DataType.DEATHS)}
          />{" "}
          DEATHS
        </label>
      </div>
      <div className={style.container}>
        <canvas id="myChart" ref={chartContainer} />
      </div>
      <div className={style.footer}>
        <div>
          Project:{" "}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://github.com/lfabianosb/covid19-world"
          >
            https://github.com/lfabianosb/covid19-world
          </a>
        </div>
        <div style={{ paddingTop: 10 }}>
          Data provided by{" "}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://github.com/pomber/covid19"
          >
            https://github.com/pomber/covid19
          </a>
        </div>
      </div>
    </div>
  );
};

export default Covid19;
