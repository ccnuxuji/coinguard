import "./StockDetailChart.css";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { LineChart, Line, Tooltip, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { getStockHistoryData, getStockHistoryData7, thunkGetStockInterval } from "../../store/stock";


function StockDetailChart({ stocksymbol, name }) {
    const data1 = useSelector(getStockHistoryData);
    const data7 = useSelector(getStockHistoryData7);
    const [data, setData] = useState(data1);
    const [value, setValue] = useState(data ? data[data.length - 1]?.close : 0);
    const [days, setDays] = useState(1);
    const dispatch = useDispatch();
    const text = { 1: "Today", 7: "Past week", 30: "Past month", 90: "Past 3 months", 365: "Past year" };
    const timeInterval = { 1: "5min" };

    const CustomTooltip = ({ active, payload, label }) => {
        useEffect(() => {
            if (active && payload && payload.length) {
                setValue(payload[0].value);
            }
        });
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

    const onMouseLeaveHandler = () => {
        if (data) {
            setValue(data[data.length - 1]?.close)
        }
    }

    useEffect(() => {
        dispatch(thunkGetStockInterval(timeInterval[days], stocksymbol))
        .then(setValue(data[data.length - 1]?.close));
    }, [dispatch]);

    if (!data) {
        return null;
    }

    return (
        <>
            <div className="total-assets-wrapper">
                <div className="company-name">{name}</div>
                <div className="total-assets">$ {value}</div>
                <div>
                    <span className={value - data[0]?.close < 0 ? "different-red" : "different-green"}>${(value - data[0]?.close).toFixed(2)}({((value - data[0]?.close) * 100 / data[0]?.close).toFixed(2)}%)</span>
                    <span>{text[days]}</span>
                </div>
            </div>

            <LineChart data={data} width={880} height={500} onMouseLeave={onMouseLeaveHandler}>
                <XAxis dataKey="date"
                    // padding={days === 1? { right: 881 * (78 - data?.length) / 78} : 0}
                    tick={false} hide={true} />
                <YAxis type="number" domain={['auto', 'auto']} tick={false} hide={true} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="close" stroke="rgb(0, 200, 5)" strokeWidth={2}
                    dot={{ stroke: 'rgb(0, 200, 5)', strokeWidth: 1, r: 0, strokeDasharray: '' }}
                />
            </LineChart>

            <div className="timeline__container">
                <div className="timeline__buttons__container">
                    <div className={`timeline__button ${days === 1 ? "active" : "" }`} onClick={() => {setDays(1); setData(data1)}}>1D</div>
                    <div className={`timeline__button ${days === 7 ? "active" : "" }`} onClick={() => {setDays(7); setData(data7)}}>1W</div>
                    <div className={`timeline__button ${days === 30 ? "active" : "" }`} onClick={() => setDays(30)}>1M</div>
                    <div className={`timeline__button ${days === 90 ? "active" : "" }`} onClick={() => setDays(90)}>3M</div>
                    <div className={`timeline__button ${days === 365 ? "active" : "" }`} onClick={() => setDays(365)}>1Y</div>
                </div>
            </div>

        </>

    );
}

export default StockDetailChart;