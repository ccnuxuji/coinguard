import { thunkGetStockInterval } from "../../store/stock";
import Navigation from "../Navigation";
import StockDetailChart from "./StockDetailChart";
import { useParams, useHistory } from 'react-router-dom';
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { thunkGetCompanyInformation, getStockDetailData } from "../../store/stock";
import "./StockDetail.css"
import { thunkBuyStock, thunkSellStock } from "../../store/order";
import { getportfolio, thunkGetPortfolio } from "../../store/portfolio";
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";
import AddToListModal from "../AddToListModal";

function StockDetail({ isLoaded }) {
    const { stocksymbol } = useParams();
    const dispatch = useDispatch();
    const history = useHistory();
    const stockDetail = useSelector(getStockDetailData);
    const portfolio = useSelector(getportfolio);
    const investments = portfolio?.Investments;
    const investment = investments?.filter(invest => invest.Stock.symbol === stocksymbol)[0];
    const [shares, setShares] = useState(0);
    const [currentPrice, setCurrentPrice] = useState(100);
    const [sidebar, setSidebar] = useState("before-order");
    const [orderType, setOrderType] = useState("buy");
    const [order, setOrder] = useState("");
    const [sellTitleClass, setSellTitleClass] = useState("buy");

    const handleBuySubmit = async (e) => {
        e.preventDefault();
        const order_to_be_submit = {
            symbol: stocksymbol,
            shares,
            buyingPrice: currentPrice
        };
        const buyorder = await dispatch(thunkBuyStock(order_to_be_submit))
            .then(setSidebar("after-order"));
        setOrder(buyorder);
    };

    const handleSellSubmit = async (e) => {
        e.preventDefault();
        const order_to_be_submit = {
            symbol: stocksymbol,
            shares,
            sellingPrice: currentPrice
        };
        const sellorder = await dispatch(thunkSellStock(order_to_be_submit))
            .then(setSidebar("after-order"));
        setOrder(sellorder);
        if (!order.investment) {
            setOrderType("buy");
        }
    };

    const handleDoneClick = (e) => {
        e.preventDefault();
        setSidebar("before-order")
    };

    const handleAddtolistsClick = (e) => {
        e.preventDefault();
    };

    const handleClickBuyTitle = (e) => {
        setOrderType("buy");
        setSellTitleClass("buy");
    }

    const handleClickSellTitle = (e) => {
        setOrderType("sell");
        setSellTitleClass("sell");
    }

    useEffect(() => {
        dispatch(thunkGetCompanyInformation(stocksymbol))
            .then(setCurrentPrice(Object.keys(stockDetail).length !== 0 ? stockDetail.price : 100));
        dispatch(thunkGetPortfolio());
    }, [dispatch]);

    useEffect(() => {
        setCurrentPrice(Object.keys(stockDetail).length !== 0 ? stockDetail.price : 100);
    }, [stockDetail]);

    return (
        <div className="stock-detail-wrapper">
            <div className="navbar">
                <Navigation isLoaded={isLoaded} />
            </div>
            <div className="stock-detail">
                <div className="stock-detail-main">
                    <StockDetailChart name={stockDetail.companyName} />
                    <div className="stock-about-wrapper">
                        <h1>About</h1>
                        <p>{stockDetail.description}</p>
                    </div>
                </div>

                <div className="stock-detail-sidebar">
                    {sidebar === "before-order" && (
                        <div className="stock-order-form-wrapper">
                            <div className="order-form-title">
                                <div id="order-buy-title" className={sellTitleClass === "buy" ? "active-green" : ""} onClick={handleClickBuyTitle}>
                                    <span>Buy {stockDetail.symbol}</span>
                                </div>
                                {investment && (
                                    <div id="order-sell-title" className={sellTitleClass === "sell" ? "active-green" : ""} onClick={handleClickSellTitle}>
                                        <span>Sell {stockDetail.symbol}</span>
                                    </div>
                                )}
                            </div>
                            {orderType === "buy" && (
                                <div>
                                    <form onSubmit={handleBuySubmit}>
                                        <div className="order-type">
                                            <div>Order Type</div>
                                            <div>Buy Order</div>
                                        </div>
                                        <div className="buy-in">
                                            <label htmlFor="buyin">Buy In</label>
                                            <select id="buyin" >
                                                <option value="option1">Shares</option>
                                            </select>
                                        </div>
                                        <div className="order-amount">
                                            <label htmlFor="orderamount">Shares</label>
                                            <input id="orderamount"
                                                type="number"
                                                value={shares}
                                                onChange={(e) => setShares(parseFloat(e.target.value))}
                                                placeholder="0"
                                                required
                                            />
                                        </div>
                                        <div className="order-market-price">
                                            <div>Market Price</div>
                                            <div>${currentPrice}</div>
                                        </div>
                                        <div className="order-market-price">
                                            <div>Estimated Cost</div>
                                            <div>${Number(currentPrice * shares)?.toFixed(2)}</div>
                                        </div>
                                        <div className="order-submit-wrapper">
                                            <button
                                                className={((currentPrice * shares > portfolio?.cashValue) || shares) <= 0 ? "disabled" : ""}
                                                type="submit"
                                                disabled={(currentPrice * shares > portfolio?.cashValue) || shares <= 0}>Review Order</button>
                                        </div>
                                    </form>
                                    <div className="order-buying-power">
                                        <div>${Number(portfolio?.cashValue)?.toFixed(2)} buying power available</div>
                                    </div>
                                </div>
                            )}

                            {orderType === "sell" && (
                                <div>
                                    <form onSubmit={handleSellSubmit}>
                                        <div className="order-type">
                                            <div>Order Type</div>
                                            <div>Sell Order</div>
                                        </div>
                                        <div className="buy-in">
                                            <label htmlFor="buyin">Sell In</label>
                                            <select id="buyin" >
                                                <option value="option1">Shares</option>
                                            </select>
                                        </div>
                                        <div className="order-amount">
                                            <label htmlFor="orderamount">Shares</label>
                                            <div>
                                                <div className="sell-all" onClick={() => setShares(Number(investment?.numShares))}>Sell all</div>
                                                <input id="orderamount"
                                                    type="number"
                                                    value={shares}
                                                    onChange={(e) => setShares(parseFloat(e.target.value))}
                                                    placeholder="0"
                                                    required
                                                />
                                            </div>

                                        </div>
                                        <div className="order-market-price">
                                            <div>Market Price</div>
                                            <div>${currentPrice}</div>
                                        </div>
                                        <div className="order-market-price">
                                            <div>Estimated Cost</div>
                                            <div>${Number(currentPrice * shares)?.toFixed(2)}</div>
                                        </div>
                                        <div className="order-submit-wrapper">
                                            <button
                                                className={((investment?.numShares < shares) || shares) <= 0 ? "disabled" : ""}
                                                type="submit"
                                                disabled={(investment?.numShares < shares) || shares <= 0}>Review Order</button>
                                        </div>
                                    </form>
                                    <div className="order-buying-power">
                                        <div>{Number(investment?.numShares)?.toFixed(2)} shares available</div>
                                    </div>
                                </div>
                            )}


                        </div>
                    )}

                    {sidebar === "after-order" && (
                        <div className="stock-after-order-wrapper">
                            <div className="order-form-title">
                                <div> Order Completed: {stocksymbol}</div>
                            </div>
                            <div className="order-form-title">
                                <div> Order Type:</div>
                                <div> {orderType}</div>
                            </div>
                            <div className="order-form-title">
                                <div> Order amount:</div>
                                <div> {Number(order?.order?.numShares * order?.order?.marketPrice)?.toFixed(2)}</div>
                            </div>
                            <div className="order-form-title">
                                <div> Number of shares:</div>
                                <div> {Number(order?.order?.numShares)?.toFixed(2)}</div>
                            </div>
                            <div className="order-submit-wrapper">
                                <button onClick={handleDoneClick}>Done</button>
                            </div>
                        </div>
                    )}

                    {sidebar === "before-order" && (
                        <div className="order-submit-wrapper">
                            <OpenModalMenuItem
                                itemType="button"
                                itemText="Add to Lists"
                                modalComponent={<AddToListModal symbol={stocksymbol} />}
                            />
                        </div>
                    )}

                </div>
            </div>


        </div>
    );
}

export default StockDetail;
