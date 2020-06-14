import React from "react";
import style from "./style.module.css";

export const SelectCountry = ({ index, countries, onSelect }) => {
  const select = (value) => {
    onSelect(index, value);
  };

  return (
    <>
      <select className={style.select} onChange={(e) => select(e.target.value)}>
        <option value=""> Select Country </option>
        {countries.map((country) => (
          <option value={country} key={country}>
            {country}
          </option>
        ))}
      </select>
    </>
  );
};
