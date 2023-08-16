import "./StockDetailChart.css";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { LineChart, Line, Tooltip, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { getStockDetailData, getStockHistoryData, getStockHistoryData7, thunkGetStockInterval } from "../../store/stock";
import { useParams } from "react-router-dom";


function StockDetailChart() {
    const { stocksymbol } = useParams();
    const data1 = useSelector(getStockHistoryData);
    const data7 = useSelector(getStockHistoryData7);
    const stockDetail = useSelector(getStockDetailData);
    const [data, setData] = useState(data7);
    const [value, setValue] = useState(data ? data[data.length - 1]?.close : 100);
    const [days, setDays] = useState(7);
    const dispatch = useDispatch();
    const text = { 1: "Today", 7: "Past week", 30: "Past month", 90: "Past 3 months", 365: "Past year" };
    const chooseData = { 1: data1, 7: data7 };
    const timeInterval = { 1: "5min", 7: "5min" };

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
            .then(setData(data7))
            .then(setValue(data[data.length - 1]?.close));
    }, [dispatch]);

    useEffect(() => {
        setData(chooseData[days]);
        setValue(chooseData[days][data.length - 1]?.close);
    }, [days, data1, data7]);

    return (
        <>
            <div className="total-assets-wrapper">
                <div className="company-name">{stockDetail?.companyName}</div>
                <div className="total-assets">$ {stockDetail?.price}</div>
                <div>
                    <span className={value - data[0]?.close < 0 ? "different-red" : "different-green"}>
                        ${Number(value - data[0]?.close)?.toFixed(2)}
                        ({Number((value - data[0]?.close) * 100 / data[0]?.close)?.toFixed(2)}%)
                    </span>
                    <span>{text[days]}</span>
                </div>
            </div>

            <LineChart data={data} width={880} height={500} onMouseLeave={onMouseLeaveHandler}>
                <XAxis dataKey="date"
                    padding={{ right: (days === 1 ? (881 * (78 - data?.length) / 78) : 0) }}
                    tick={false} hide={true} />
                <YAxis type="number" domain={['auto', 'auto']} tick={false} hide={true} />
                <Tooltip content={<CustomTooltip />} />
                {/* "rgb(0, 200, 5)" */}
                <Line type="monotone" dataKey="close" stroke={data[data.length - 1]?.close - data[0]?.close < 0 ? "rgb(255, 80, 0)" : "rgb(0, 200, 5)"} strokeWidth={2}
                    dot={{ stroke: 'rgb(0, 200, 5)', strokeWidth: 1, r: 0, strokeDasharray: '' }}
                />
            </LineChart>

            <div className="timeline__container">
                <div className="timeline__buttons__container">
                    <div className={`timeline__button ${days === 1 ? (data[data.length - 1]?.close - data[0]?.close < 0 ? "active-red" : "active-green") : ""}`}
                        onClick={() => { setDays(1); setData(data1) }}>1D</div>
                    <div className={`timeline__button ${days === 7 ? (data[data.length - 1]?.close - data[0]?.close < 0 ? "active-red" : "active-green") : ""}`}
                        onClick={() => { setDays(7); setData(data7) }}>1W</div>
                    <div className={`timeline__button ${days === 30 ? (data[data.length - 1]?.close - data[0]?.close < 0 ? "active-red" : "active-green") : ""}`}
                        onClick={() => setDays(30)}>1M</div>
                    <div className={`timeline__button ${days === 90 ? (data[data.length - 1]?.close - data[0]?.close < 0 ? "active-red" : "active-green") : ""}`}
                        onClick={() => setDays(90)}>3M</div>
                    <div className={`timeline__button ${days === 365 ? (data[data.length - 1]?.close - data[0]?.close < 0 ? "active-red" : "active-green") : ""}`}
                        onClick={() => setDays(365)}>1Y</div>
                </div>
            </div>

        </>

    );
}

export default StockDetailChart;