import { thunkGetPortfolio, getportfolio } from "../../store/portfolio";
import OpenModalMenuItem from '../Navigation/OpenModalMenuItem';
import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import Navigation from "../Navigation";
import StockLineChart from "../StockLineChart"
import "./Portfolio.css";
import TrasferFormModal from "../TrasferFormModal"
import { getWatchlists, thunkGetWatchlists } from "../../store/watchlist";
import WithdrawModal from "../TrasferFormModal/WithdrawModal";
import WatchlistFormModal from "../WatchlistFormModal";
import WatchlistEditModal from "../WatchlistFormModal/WatchlistEditModal";
import WatchlistDeleteModal from "../WatchlistFormModal/WatchlistDeleteModal";
import { useHistory } from "react-router-dom";
import { getGeneralNews, getMiniChartData, thunkGetGeneralNews, thunkGetMinichartStockData } from "../../store/stock";
import { LineChart, Line, YAxis, ReferenceLine } from 'recharts';


function Portfolio({ isLoaded }) {
    const history = useHistory();
    const dispatch = useDispatch();
    const portfolio = useSelector(getportfolio);
    const generalNews = useSelector(getGeneralNews);
    const watchlists = useSelector(getWatchlists);
    const minichartData = useSelector(getMiniChartData);
    console.log(minichartData);
    
    const [showBuyingPower, setShowBuyingPower] = useState(false);
    const [showWatchList, setShowWatchList] = useState(Array(watchlists.length).fill(false));
    // const [miniChartData, setMiniChartData] = useState([]);

    const clickBuyingPower = () => {
        setShowBuyingPower((prev) => !prev);
    };

    const handleClickWatchlist = (i) => {
        const updated_array = [...showWatchList];
        updated_array[i] = !updated_array[i];
        setShowWatchList(updated_array);
    }

    useEffect(() => {
        dispatch(thunkGetPortfolio());
        dispatch(thunkGetWatchlists());
        dispatch(thunkGetGeneralNews());
    }, [dispatch]);

    useEffect(() => {
        const stocksSet = new Set();
        portfolio?.Investments?.forEach(investment => {
            stocksSet.add(investment.Stock.symbol);
        });
        watchlists.forEach(watchlist => {
            watchlist.Stocks?.forEach(stock => {
                stocksSet.add(stock.symbol);
            });
        });
        const stockLists = [...stocksSet];
        if (stockLists.length > 0) {
            dispatch(thunkGetMinichartStockData(stockLists));
        }
    }, [portfolio]);


    return (
        <div className="portfolio-wrapper">
            <div className="navbar">
                <Navigation isLoaded={isLoaded} />
            </div>

            <div className="portfolio-detail">
                <div className="portfolio-main">
                    <div className="portfolio-line-chart">
                        <StockLineChart data={portfolio?.dataOneyear} />
                        {/* <TimeLine /> */}
                    </div>
                    <div className="portfolio-buyingpower-wrapper" onClick={clickBuyingPower}>
                        <div className="portfolio-buyingpower">Buying power</div>
                        {!showBuyingPower && (
                            <div>Click here to add fund...</div>
                        )}
                        <div className="portfolio-cashvalue">$ {Number(portfolio?.cashValue)?.toFixed(2)}</div>
                    </div>

                    {showBuyingPower &&
                        (
                            <div className="portfolio-buyingpower-detail-wrapper">
                                <div className="portfolio-buyingpower-detail">
                                    <div className="portfolio-buyingpower-brokerage">
                                        <div>Brokerage cash</div>
                                        <div>$ {Number(portfolio?.cashValue)?.toFixed(2)}</div>
                                    </div>
                                    <div className="portfolio-buyingpower-total">
                                        <div>Total</div>
                                        <div>$ {Number(portfolio?.cashValue)?.toFixed(2)}</div>
                                    </div>
                                    <div className="portfolio-trasferbutton-wrapper">
                                        <OpenModalMenuItem
                                            itemType="button"
                                            itemText="Deposit"
                                            // onItemClick={closeMenu}
                                            modalComponent={<TrasferFormModal />}
                                        />
                                        <OpenModalMenuItem
                                            itemType='button'
                                            itemText="Withdraw"
                                            // onItemClick={closeMenu}
                                            modalComponent={<WithdrawModal />}
                                        />
                                    </div>
                                </div>
                            </div>
                        )
                    }

                    <div className="stock-recomendation-wrapper">
                        <div className="stock-recomendation-title">
                            <h3>Find some interesting stocks here:</h3>
                        </div>
                        <div className="stock-recomendation-list">
                            <div onClick={() => history.push("/stock/AAPL")}>AAPL</div>
                            <div onClick={() => history.push("/stock/GOOGL")}>GOOGL</div>
                            <div onClick={() => history.push("/stock/MSFT")}>MSFT</div>
                            <div onClick={() => history.push("/stock/META")}>META</div>
                            <div onClick={() => history.push("/stock/AMZN")}>AMZN</div>
                            <div onClick={() => history.push("/stock/TSLA")}>TSLA</div>
                        </div>
                    </div>

                    <div className="general-news-wrapper">
                        <div className="general-news-title">
                            <h3>Top news</h3>
                        </div>
                        <div className="stock-news-list">
                            {
                                generalNews?.map(newsItem => {
                                    const tmp = new Date(newsItem.datetime);
                                    return (
                                        <div className="newsItem-wrapper" key={newsItem.id} onClick={() => window.location.href = newsItem.url}>
                                            <div className="newsItem-main">
                                                <div className="news-source">{newsItem.source}</div>
                                                <div className="news-headline">{newsItem.headline}</div>
                                                <div className="news-summary">{newsItem.summary}</div>
                                            </div>
                                            <div className="newsItem-img-wrapper">
                                                <img alt="" src={newsItem.image} />
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>



                </div>
                <div className="portfolio-sidebar">
                    <div className="investments-header-wrapper">
                        <div className="investments-header">
                            Investments:
                        </div>
                        <div>
                            $ {Number(portfolio?.totalAssets)?.toFixed(2)}
                        </div>
                    </div>
                    <div className="investments-list">
                        {portfolio?.Investments.length === 0 && (
                            <div className="empty-investments">Find some stocks to buy...</div>
                        )}
                        {
                            portfolio?.Investments.map(investment => {
                                let data = (minichartData[investment.Stock.symbol])?.c;
                                data = data?.map(x => ({ pv: x }));
                                // console.log(data);
                                return (
                                    <Link className="stock-list-item" key={investment.id} to={`/stock/${investment.Stock.symbol}`}>
                                        <div className="stocklist-item-symbol">
                                            {investment.Stock.symbol}
                                        </div>
                                        <div className="stocklist-item-minichart">
                                            <LineChart data={data}
                                                width={80} height={35}
                                            >
                                                <YAxis type="number" domain={['auto', 'auto']} tick={false} hide={true} />
                                                <ReferenceLine y={data ? data[0]?.pv : ""}  stroke="#42494B" strokeDasharray="3 3" />
                                                <Line type="monotone"
                                                    dataKey="pv"
                                                    stroke={data ? (data[data?.length - 1]?.pv < data[0]?.pv ? "rgb(255, 80, 0)" : "rgb(0, 200, 5)") : "rgb(0, 200, 5)"}
                                                    strokeWidth={2}
                                                    dot={{ stroke: 'rgb(0, 200, 5)', strokeWidth: 1, r: 0, strokeDasharray: '' }}
                                                />
                                            </LineChart>
                                        </div>
                                        <div className="stocklist-item-priceDetail">
                                            <div className={data ? (data[data?.length - 1]?.pv > data[0]?.pv ? "stocklist-item-price" : "stocklist-item-price-red") : ""}>
                                                ${Number(data ? data[data.length - 1].pv : 345.45).toFixed(2)}</div>
                                            <div className={data ? (data[data?.length - 1]?.pv > data[0]?.pv ? "stocklist-item-difference" : "stocklist-item-difference-red") : ""}>
                                                <span>{Number(data ? (data[data.length - 1].pv - data[0]?.pv) * 100 / data[0].pv : 0.00).toFixed(2)}%</span></div>
                                            {/* <div className="stocklist-item-price" >$298.45</div>
                                            <div className="stocklist-item-difference" ><span>+0.28%</span></div> */}
                                        </div>
                                    </Link>
                                )
                            })
                        }
                    </div>
                    <div className="watchlists-header-wrapper">
                        <div className="watchlists-header">
                            Lists
                        </div>
                        <div className="plus-svg-wrapper" >
                            <OpenModalMenuItem
                                itemType="plusicon"
                                itemText="test"
                                modalComponent={<WatchlistFormModal />}
                            />
                        </div>
                    </div>
                    <div className="watchlists-list">
                        {watchlists?.length === 0 && (
                            <div className="empty-investments">Create some watchlists...</div>
                        )}
                        {
                            watchlists?.map((watchlist, i) => (
                                <div className="watchlist-item" key={watchlist.id} onClick={() => handleClickWatchlist(i)}>
                                    <div className="watchlist-name">
                                        <div>{watchlist.name}</div>
                                        <div className="watchlist-edit">
                                            <OpenModalMenuItem
                                                itemType="editicon"
                                                itemText="test"
                                                modalComponent={<WatchlistEditModal watchlist={watchlist} />}
                                            />
                                            <OpenModalMenuItem
                                                itemType="trashicon"
                                                itemText="test"
                                                modalComponent={<WatchlistDeleteModal watchlist={watchlist} />}
                                            />

                                        </div>
                                    </div>
                                    {showWatchList[i] &&
                                        watchlist.Stocks?.map(sto => {
                                            let data = (minichartData[sto.symbol])?.c;
                                            data = data?.map(x => ({ pv: x }));
                                            return (
                                                <Link className="watch-list-item" key={sto.id} to={`/stock/${sto.symbol}`}>
                                                    <div className="stocklist-item-symbol">
                                                        {sto.symbol}
                                                    </div>
                                                    <div className="stocklist-item-minichart">
                                                        <LineChart data={data}
                                                            width={80} height={35}
                                                        >
                                                            <YAxis type="number" domain={['auto', 'auto']} tick={false} hide={true} />
                                                            <ReferenceLine y={data ? data[0]?.pv : ""}  stroke="#42494B" strokeDasharray="3 3" />
                                                            <Line type="monotone"
                                                                dataKey="pv"
                                                                stroke={data ? (data[data?.length - 1]?.pv < data[0]?.pv ? "rgb(255, 80, 0)" : "rgb(0, 200, 5)") : "rgb(0, 200, 5)"}
                                                                strokeWidth={2}
                                                                dot={{ stroke: 'rgb(0, 200, 5)', strokeWidth: 1, r: 0, strokeDasharray: '' }}
                                                            />
                                                        </LineChart>
                                                    </div>
                                                    <div className="stocklist-item-priceDetail">
                                                        <div className={data ? (data[data?.length - 1]?.pv > data[0]?.pv ? "stocklist-item-price" : "stocklist-item-price-red") : ""}>
                                                            ${Number(data ? data[data.length - 1].pv : 345.45).toFixed(2)}</div>
                                                        <div className={data ? (data[data?.length - 1]?.pv > data[0]?.pv ? "stocklist-item-difference" : "stocklist-item-difference-red") : ""}>
                                                            <span>{Number(data ? (data[data.length - 1].pv - data[0]?.pv) * 100 / data[0].pv : 0.00).toFixed(2)}%</span></div>
                                                    </div>
                                                </Link>
                                            )
                                        })
                                    }
                                </div>
                            ))
                        }
                    </div>
                </div>

            </div>
        </div>
    );
}

export default Portfolio;