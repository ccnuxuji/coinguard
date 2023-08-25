import "./OrderHistory.css";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useParams, useHistory } from 'react-router-dom';
import { getCurrentUser } from "../../store/session";
import { getOrders, getTransactions, thunkGetOrders, thunkGetTransactions } from "../../store/order";
import Navigation from "../Navigation";

function OrderHistory({ isLoaded }) {
    const dispatch = useDispatch();
    const user = useSelector(getCurrentUser);
    const orders = useSelector(getOrders);
    const transactions = useSelector(getTransactions);
    const [showOrders, setShowOrders] = useState(true);

    const handleClickOrders = () => {
        setShowOrders(true);
    }

    const handleClickTransfers = () => {
        setShowOrders(false);
    }

    useEffect(() => {
        dispatch(thunkGetOrders());
        dispatch(thunkGetTransactions());
    }, [dispatch]);

    return (
        <div className="order-history-body-wrapper">
            <div className="navbar">
                <Navigation isLoaded={isLoaded} />
            </div>
            <div className="order-history-main">
                <div className="history-title-wrapper">
                    <h1>{user?.firstName}</h1>
                    <div className="history-title-tab">
                        <div
                            className={showOrders ? "active1" : ""}
                            onClick={handleClickOrders}>Orders</div>
                        <div
                            className={showOrders ? "" : "active1"}
                            onClick={handleClickTransfers}>Transfers</div>
                    </div>
                </div>

                {showOrders ?
                    <div className="order-history-wrapper">
                        {
                            orders.map(order => (
                                <div className="order-item-wrapper" key={order.id}>
                                    <div className="order-item-col">
                                        <div>{order.Stock.symbol} Market {order.orderType}</div>
                                        <div>${order.numShares * order.marketPrice}</div>
                                    </div>
                                    <div className="order-item-col">
                                        <div>Type: Market {order.orderType}</div>
                                        <div>{order.orderType} at {order.createdAt}</div>
                                    </div>
                                    <div className="order-item-col">
                                        <div>Number of Shares: {order.numShares}</div>
                                        <div>Market price: {order.marketPrice}</div>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                    :
                    <div className="transfer-history-wrapper">
                        {
                            transactions.map(transaction => (
                                <div className="order-item-wrapper" key={transaction.id}>
                                    <div className="order-item-col">
                                        <div>{transaction.transactionType}</div>
                                        <div>${Number(transaction.amount).toFixed(2)}</div>
                                    </div>
                                    <div className="order-item-col">
                                        <div>Type:  {transaction.transactionType}</div>
                                        <div>{transaction.transactionType} at {transaction.createdAt}</div>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                }
            </div>
        </div>
    );
}

export default OrderHistory;