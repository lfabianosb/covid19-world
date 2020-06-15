import React from "react";
import "./style.css";

export const SelectCountry = ({ index, countries, onSelect }) => {
  const select = (value) => {
    onSelect(index, value);
  };

  return (
    <div className="select">
      <select onChange={(e) => select(e.target.value)}>
        <option value=""> Select Country </option>
        {countries.map((country) => (
          <option value={country} key={country}>
            {country}
          </option>
        ))}
      </select>
    </div>
  );
};
