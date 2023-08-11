import "./StockLineChart.css";
import "./TimeLine.css"
import { LineChart, Line, Tooltip, ResponsiveContainer, XAxis } from 'recharts';

function StockLineChart({ data }) {

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="label">{`Time: ${label}`}</p>
          <p className="label">{`Value: ${payload[0].value}`}</p>
          {/* <p className="desc">Anything you want can be displayed here.</p> */}
        </div>
      );
    }

    return null;
  };

  return (
    <>
      <div className="total-assets-wrapper">
        <div className="total-assets">$ 100.67</div>
        <div>$0.22(23.44%)Past Year</div>
      </div>

      <ResponsiveContainer width={880} height={500}>
        <LineChart data={data} >
          <XAxis dataKey="time"
            padding={{ right: 881 * (288 - data?.length) / 288 }}
            tick={false} hide={true} />
          <Tooltip content={<CustomTooltip />} />
          <Line type="monotone" dataKey="totalAssets" stroke="rgb(0, 200, 5)" strokeWidth={2}
            dot={{ stroke: 'rgb(0, 200, 5)', strokeWidth: 1, r: 0, strokeDasharray: '' }}
          />

        </LineChart>
      </ResponsiveContainer>

      <div className="timeline__container">
        <div className="timeline__buttons__container">
          <div className="timeline__button active">1D</div>
          <div className="timeline__button">1W</div>
          <div className="timeline__button">1M</div>
          <div className="timeline__button">3M</div>
          <div className="timeline__button">1Y</div>
          <div className="timeline__button">5Y</div>
        </div>
      </div>

    </>

  );
}

export default StockLineChart;