import "./WatchlistDetail.css";
import Navigation from "../Navigation";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useParams, useHistory } from 'react-router-dom';
import { getWatchlists, getWatchlists2, thunkDeleteStockFromWatchlist, thunkGetWatchlists } from "../../store/watchlist";
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";
import WatchlistFormModal from "../WatchlistFormModal";
import WatchlistDeleteModal from "../WatchlistFormModal/WatchlistDeleteModal";
import { Link } from "react-router-dom/cjs/react-router-dom.min";



function WatchlistDetail({ isLoaded }) {
    const history = useHistory();
    const dispatch = useDispatch();
    const { watchlistId } = useParams();
    const watchlists = useSelector(getWatchlists);
    const watchlists2 = useSelector(getWatchlists2);
    const watchlist = watchlists2[watchlistId];

    const handleDeleteStockFromWatchlist = async (stockId) => {
        dispatch(thunkDeleteStockFromWatchlist(watchlistId, stockId))
        // .then(history.push("/portfolio"));
    };

    useEffect(() => {
        dispatch(thunkGetWatchlists());
    }, [dispatch]);

    return (
        <div className="watchlist-detail-wrapper">
            <div className="navbar">
                <Navigation isLoaded={isLoaded} />
            </div>
            <div className="watchlist-main-wrapper">
                <div className="watchlist-main">
                    <div className="list-title-wrapper">
                        <h2>{watchlist?.name}   ({watchlist?.Stocks.length}items)</h2>
                        <div className="watchlist-edit">
                            <OpenModalMenuItem
                                itemType="trashicon"
                                itemText="test"
                                modalComponent={<WatchlistDeleteModal watchlist={watchlist} />}
                            />
                        </div>
                    </div>
                    <div className="watchlist-stock-items">
                        <div className="watchlist-stock-item">
                            {/* <div>Name</div> */}
                            <div>Symbol</div>
                            <div>Price</div>
                            {/* <div>Today</div> */}
                            {/* <div>Market Cap</div> */}
                            <div></div>
                        </div>
                        {
                            watchlist?.Stocks.map(stock => (
                                <div className="watchlist-stock-item watchlist-stock-item1" key={stock.id}>
                                    {/* <div>company name</div> */}
                                    <div>{stock.symbol}</div>
                                    <div>$145.68</div>
                                    {/* <div>today</div> */}
                                    {/* <div>market cap</div> */}
                                    <div onClick={() => handleDeleteStockFromWatchlist(stock.id)}><i className="fa-solid fa-xmark"></i></div>
                                </div>
                            ))
                        }

                    </div>
                </div>
                <div className="wathclist-sidebar">
                    <div className="watchlist-sidebar-title">
                        <div className="lists-text">Lists</div>
                        <div className="plus-svg-wrapper" >
                            <OpenModalMenuItem
                                itemType="plusicon"
                                itemText="test"
                                modalComponent={<WatchlistFormModal />}
                            />
                        </div>
                    </div>
                    <div className="watchlist-item-wrapper1">
                        {
                            watchlists.map(wl => (
                                <Link className="watchlist-item1" key={wl.id} to={`/watchlist/${wl.id}`}>
                                    <div>{wl.name}</div>
                                </Link>
                            ))
                        }

                    </div>
                </div>
            </div>

        </div>
    );
}

export default WatchlistDetail;