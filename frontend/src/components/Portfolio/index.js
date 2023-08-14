import { thunkGetPortfolio, getportfolio } from "../../store/portfolio";
import OpenModalMenuItem from '../Navigation/OpenModalMenuItem';
import { useEffect, useState } from "react";
import { Link, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import Navigation from "../Navigation";
import StockLineChart from "../StockLineChart"
import "./Portfolio.css";
import TrasferFormModal from "../TrasferFormModal"
import { getWatchlists, thunkGetWatchlists } from "../../store/watchlist";
import WithdrawModal from "../TrasferFormModal/WithdrawModal";

function Portfolio({ isLoaded }) {
    const dispatch = useDispatch();
    const portfolio = useSelector(getportfolio);
    const watchlists = useSelector(getWatchlists);
    const [showBuyingPower, setShowBuyingPower] = useState(false);

    const clickBuyingPower = () => {
        setShowBuyingPower((prev) => !prev);
    };

    useEffect(() => {
        dispatch(thunkGetPortfolio());
        dispatch(thunkGetWatchlists());
    }, []);

    return (
        <div className="portfolio-wrapper">
            <div className="navbar">
                <Navigation isLoaded={isLoaded} />
            </div>

            <div className="portfolio-detail">
                <div className="portfolio-main">
                    <div className="portfolio-line-chart">
                        <StockLineChart data={portfolio?.dataToday} />
                        {/* <TimeLine /> */}
                    </div>
                    <div className="portfolio-buyingpower-wrapper" onClick={clickBuyingPower}>
                        <div className="portfolio-buyingpower">Buying power</div>
                        <div className="portfolio-cashvalue">$ {portfolio?.cashValue}</div>
                    </div>

                    {showBuyingPower &&
                        (
                            <div className="portfolio-buyingpower-detail-wrapper">
                                <div className="portfolio-buyingpower-detail">
                                    <div className="portfolio-buyingpower-brokerage">
                                        <div>Brokerage cash</div>
                                        <div>$ {portfolio?.cashValue}</div>
                                    </div>
                                    <div className="portfolio-buyingpower-total">
                                        <div>Total</div>
                                        <div>$ {portfolio?.cashValue}</div>
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

                </div>
                <div className="portfolio-sidebar">
                    <div className="investments-header-wrapper">
                        <div className="investments-header">
                            Investments
                        </div>
                    </div>
                    <div className="investments-list">
                        {
                            portfolio?.Investments.map(investment => (
                                <Link className="stock-list-item" key={investment.id} to={`/stock/${investment.Stock.symbol}`}>
                                    <div className="stocklist-item-symbol">
                                        {investment.Stock.symbol}
                                    </div>
                                    <div className="stocklist-item-minichart">
                                        mini chart
                                    </div>
                                    <div className="stocklist-item-priceDetail">
                                        <div className="stocklist-item-price">$1276.55</div>
                                        <div className="stocklist-item-difference"><span>+0.11%</span></div>
                                    </div>
                                </Link>
                            ))
                        }
                    </div>
                    <div className="watchlists-header-wrapper">
                        <div className="watchlists-header">
                            Lists
                        </div>
                    </div>
                    <div className="watchlists-list">
                        {
                            watchlists?.map(watchlist => (
                                <div className="watchlist-item" key={watchlist.id}>
                                    <div className="watchlist-name">
                                        {watchlist.name}
                                    </div>
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