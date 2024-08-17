import Button from "../UI/Button";
import './Buttons.css';

export default function Buttons (props) {
  return (
    <div className="buttons">
      {props.buttons.map(button => (
        <Button
          key={button.id}
          id={button.id}
          label={button.label}
          isActive={props.activeButton === button.id ? true : false}
          onClick={props.onButtonSelection}
        />
      ))}
    </div>
  );
};
