import React from "react";

const SelectCountry = ({ countries, onSelect }) => {
  const select = (value) => {
    onSelect(value);
  };

  return (
    <>
      <select onChange={(e) => select(e.target.value)}>
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

export default SelectCountry;
