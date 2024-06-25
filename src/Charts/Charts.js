import LineChart from './LineChart';
import NetworkGraph from './NetworkGraph';

export default function Charts() {
  const margin = {top: 30, right: 10, bottom: 50, left: 60};

  return (
    <>
      <h1>Distribution Dashboard</h1>
      <div className='wrapper'>
        <div className='one'>
          <NetworkGraph margin={margin} />
        </div>
        <div className='two'>
          <LineChart margin={margin} />
        </div>
      </div>
    </>
  )
};
