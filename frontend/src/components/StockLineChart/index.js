import "./StockLineChart.css";
import "./TimeLine.css";
import { useState, useEffect } from "react";
import { LineChart, Line, Tooltip, XAxis, YAxis } from 'recharts';

function StockLineChart({ data }) {
  const [value, setValue] = useState(data ? data[data.length - 1]?.totalAssets : '');
  const CustomTooltip = ({ active, payload, label }) => {
    useEffect(() => {
      if (active && payload && payload.length) {
        setValue(payload[0].value);
      }
    });
    if (active && payload && payload.length) {
      // setValue(payload[0].value);
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

  const onMouseLeaveHandler = () => {
    if (data) {
      setValue(data[data.length - 1].totalAssets)
    }
  }

  useEffect(() => {
    if (data) {
      setValue(data[data.length - 1].totalAssets);
    }
  }, [data]);


  if (!data) return null;

  return (
    <>
      <div className="total-assets-wrapper">
        <div className="total-assets">$ {value}</div>
        <div>${value - data[0]?.totalAssets}({(value - data[0]?.totalAssets) / data[0]?.totalAssets}%)Past Year</div>
      </div>

      <LineChart data={data} width={880} height={500} onMouseLeave={onMouseLeaveHandler}>
        <XAxis dataKey="time"
          padding={{ right: 881 * (288 - data?.length) / 288 }}
          tick={false} hide={true} />
        <YAxis type="number" domain={['auto', 'auto']} tick={false} hide={true} />
        <Tooltip content={<CustomTooltip />} />
        <Line type="monotone" dataKey="totalAssets" stroke="rgb(0, 200, 5)" strokeWidth={2}
          dot={{ stroke: 'rgb(0, 200, 5)', strokeWidth: 1, r: 0, strokeDasharray: '' }}
        />
      </LineChart>

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