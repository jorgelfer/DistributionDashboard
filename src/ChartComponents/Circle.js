export default function Circle(props) {
  return (
    <circle 
      className={props.class}
      id={props.id}
      cx={props.cx}
      cy={props.cy}
      r={props.r}
      fill={props.fill}
      stroke={props.stroke ? props.stroke : "none"}
      strokeWidth={props.strokeWidth ? props.strokeWidth : 0} 
      onClick={props.onClick? props.onClick : null}
      onDoubleClick={props.onDoubleClick? props.onDoubleClick : null}
    />
  )
};