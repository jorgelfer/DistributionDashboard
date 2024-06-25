import ChartContainer from '../ChartComponents/ChartContainer';
import Card from '../UI/Card';

export default function LineChart(props) {
  const width = 700;
  const height = 500;
  const innerWidth = width - props.margin.left - props.margin.right;
  const innerHeight = height - props.margin.top - props.margin.bottom;

  return(
    <Card>
      <h2>Operation Values</h2>
      <ChartContainer
        width={width}
        height={height}
        margin={props.margin}
      >
      </ChartContainer> 
    </Card>
  );
}