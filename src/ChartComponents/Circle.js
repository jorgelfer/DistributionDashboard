export default function Circle(props) {
  return (
    <circle 
      className={props.class}
      cx={props.cx}
      cy={props.cy}
      r={props.r}
      fill={props.fill}
      stroke={props.stroke ? props.stroke : "none"}
      strokeWidth={props.strokeWidth ? props.strokeWidth : 0} 
    />
  )
};