export default function Image(props) {
  return (
    <image
      className={props.class}
      x1={props.x1}
      y1={props.y1}
      x2={props.x2}
      y2={props.y2}
      fill="none"
      stroke={props.stroke}
      strokeWidth={props.strokeWidth}
    />
  );
};