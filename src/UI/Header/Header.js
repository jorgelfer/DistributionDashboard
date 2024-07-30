import './Header.css';
import { DATADISPLAY } from "./data.js";

export default function Header({ handleClick, selectedValue }) {

    function DataDisplay({children, isSelected, ...props}) {
      return (
        <li className={isSelected ? "main-tab active" : "main-tab"} {...props}>
        <img src={children.image} alt={children.title} />
        <p>{children.title}</p>
        </li>
      );
    };

    return (
      <div id="main-header">
        <ul>
          {Object.keys(DATADISPLAY).map((objKey) => 
            <DataDisplay 
            key={objKey} 
            isSelected={selectedValue === objKey}
            onClick={() => handleClick(objKey)}>
              {DATADISPLAY[objKey]}
            </DataDisplay>
          )}
        </ul>
      </div>
    );
};