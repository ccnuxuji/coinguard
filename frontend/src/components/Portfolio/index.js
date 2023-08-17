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
import { getGeneralNews, thunkGetGeneralNews } from "../../store/stock";

function Portfolio({ isLoaded }) {
    const history = useHistory();
    const dispatch = useDispatch();
    const portfolio = useSelector(getportfolio);
    const generalNews = useSelector(getGeneralNews);
    const watchlists = useSelector(getWatchlists);
    const [showBuyingPower, setShowBuyingPower] = useState(false);
    const [showWatchList, setShowWatchList] = useState(Array(watchlists.length).fill(false));

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
                            <div onClick={() => history.push("/stock/TGT")}>TGT</div>
                            <div onClick={() => history.push("/stock/APP")}>APP</div>
                            <div onClick={() => history.push("/stock/CATC")}>CATC</div>
                            <div onClick={() => history.push("/stock/PEGY")}>PEGY</div>
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
                                    console.log(tmp)
                                    return (
                                        <div className="newsItem-wrapper" key={newsItem.id} onClick={() => window.location.href = newsItem.url}>
                                            <div className="newsItem-main">
                                                <div>From {newsItem.source}</div>
                                                <div>{newsItem.headline}</div>
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
                            $ {portfolio?.totalAssets}
                        </div>
                    </div>
                    <div className="investments-list">
                        {portfolio?.Investments.length === 0 && (
                            <div className="empty-investments">Find some stocks to buy...</div>
                        )}
                        {
                            portfolio?.Investments.map(investment => {
                                const p = Math.random() - 0.5;
                                return (
                                    <Link className="stock-list-item" key={investment.id} to={`/stock/${investment.Stock.symbol}`}>
                                        <div className="stocklist-item-symbol">
                                            {investment.Stock.symbol}
                                        </div>
                                        <div className="stocklist-item-minichart">
                                            mini chart
                                        </div>
                                        <div className="stocklist-item-priceDetail">
                                            <div className={p > 0 ? "stocklist-item-price" : "stocklist-item-price-red"}>${(200 * (1 + p)).toFixed(2)}</div>
                                            <div className={p > 0 ? "stocklist-item-difference" : "stocklist-item-difference-red"}><span>{p.toFixed(2)}%</span></div>
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
                                        watchlist.Stocks?.map(sto => (
                                            <Link className="watch-list-item" key={sto.id} to={`/stock/${sto.symbol}`}>
                                                <div className="stocklist-item-symbol">
                                                    {sto.symbol}
                                                </div>
                                                <div className="stocklist-item-minichart">
                                                    mini chart
                                                </div>
                                                <div className="stocklist-item-priceDetail">
                                                    <div className="stocklist-item-price">$236.65</div>
                                                    <div className="stocklist-item-difference"><span>+0.12%</span></div>
                                                </div>
                                            </Link>
                                        ))
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