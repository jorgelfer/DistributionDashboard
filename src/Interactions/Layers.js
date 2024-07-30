import Button from "../UI/Button";
import './Layers.css';

export default function Layers (props) {
  return (
    <div className="layers">
      {props.layers.map(layer => (
        <Button
          key={layer.id}
          id={layer.id}
          label={layer.label}
          isActive={props.activeLayer === layer.id ? true : false}
          onClick={props.onLayerSelection}
        />
      ))}
    </div>
  );
};
