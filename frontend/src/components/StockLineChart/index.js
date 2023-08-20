import "./StockLineChart.css";
import "./TimeLine.css";
import { useState, useEffect } from "react";
import { LineChart, Line, Tooltip, XAxis, YAxis } from 'recharts';

function StockLineChart({ data }) {
  const [value, setValue] = useState(data ? data[data.length - 1]?.totalAssets : 0);
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
          <p className="label">{`${label}`}</p>
          <p className="label">{`Value: ${(payload[0].value).toFixed(2)}`}</p>
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
        <div className={`total-assets`}>$ {value?.toFixed(2)}</div>
        <div ><span className={`${(value - data[0]?.totalAssets) < 0 ? "difference-red" : "difference-green"}`}>
          ${(value - data[0]?.totalAssets).toFixed(2)}
          ({((value - data[0]?.totalAssets) * 100 / data[0]?.totalAssets).toFixed(2)}%)</span>Past year(sample data)</div>
      </div>

      <LineChart data={data} width={880} height={500} onMouseLeave={onMouseLeaveHandler}>
        <XAxis dataKey="time"
          // padding={{ right: 881 * (288 - data?.length) / 288 }}
          tick={false} hide={true} />
        <YAxis type="number" domain={['auto', 'auto']} tick={false} hide={true} />
        <Tooltip content={<CustomTooltip />} />
        {/* <Line type="monotone" dataKey="totalAssets" stroke="rgb(0, 200, 5)" strokeWidth={2}
          dot={{ stroke: 'rgb(0, 200, 5)', strokeWidth: 1, r: 0, strokeDasharray: '' }}
        /> */}
        <Line type="monotone" dataKey="totalAssets" stroke={data[data.length - 1]?.totalAssets - data[0]?.totalAssets < 0 ? "rgb(255, 80, 0)" : "rgb(0, 200, 5)"} strokeWidth={2}
          dot={{ stroke: 'rgb(0, 200, 5)', strokeWidth: 1, r: 0, strokeDasharray: '' }}
        />
      </LineChart>

      <div className="timeline__container">
        <div className="timeline__buttons__container">
          <div className="timeline__button">1D</div>
          <div className="timeline__button">1W</div>
          <div className="timeline__button">1M</div>
          <div className="timeline__button">3M</div>
          <div className="timeline__button active">1Y</div>
          <div className="timeline__button">5Y</div>
        </div>
      </div>

    </>

  );
}

export default StockLineChart;