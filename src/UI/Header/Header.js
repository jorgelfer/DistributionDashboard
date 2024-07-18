import React from "react";
import { useState } from "react";

import './Header.css';
import { DATADISPLAY } from "./data.js";

function DataDisplay({children, onClick, isSelected}) {

  return (
    <li className={isSelected ? "main-tab active" : "main-tab"} onClick={onClick}>
      <img src={children.image} alt={children.title} />
      <p>{children.title}</p>
    </li>
  );

}

export default function Header() {

  const [selectedValue, setSelectedValue] = useState('vm');

  function handleClick(selectedButton) {
    if (selectedValue !== selectedButton) {
      setSelectedValue(selectedButton);
    }
  }

  return (
    <div id="main-header">
      <ul>
        {Object.keys(DATADISPLAY).map((objKey) => 
          <DataDisplay key={objKey} isSelected={selectedValue === objKey}
          onClick={() => handleClick(objKey)}>
            {DATADISPLAY[objKey]}
          </DataDisplay>
        )}
      </ul>
    </div>
  );
}