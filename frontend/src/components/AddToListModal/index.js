import "./AddToListModal.css";
import { getWatchlists, thunkAddStockToWatchlists, thunkGetWatchlists } from "../../store/watchlist";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useModal } from "../../context/Modal";


function AddToListModal({ symbol }) {
    const { closeModal } = useModal();
    const dispatch = useDispatch();
    const watchlists = useSelector(getWatchlists);
    const newArr = Array(watchlists.length).fill(false);
    const newWatchlistIdSet = new Set();

    const [checkedArr, setCheckedArr] = useState(newArr);
    const [watchlistIdSet, setWatchlistIdSet] = useState(newWatchlistIdSet);
    const handleCheckbox = (wl, index) => {
        const newArr1 = [...checkedArr];
        newArr1[index] = !newArr1[index];
        setCheckedArr(newArr1);
        let newSet = new Set(watchlistIdSet);
        if (newSet.has(wl.id)) {
            newSet.delete(wl.id);
        } else {
            newSet.add(wl.id);
        }
        setWatchlistIdSet(newSet);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const watchlistIds = [...watchlistIdSet];
        dispatch(thunkAddStockToWatchlists(symbol, watchlistIds)).then(closeModal())
    }

    useEffect(() => {
        dispatch(thunkGetWatchlists());
    }, [dispatch])

    useEffect(() => {
        watchlists?.forEach((wl, index) => {
            if (wl.Stocks.some(obj => obj.symbol === symbol)) {
                newArr[index] = true;
                newWatchlistIdSet.add(wl.id);
            }
        });
    }, [watchlists])

    return (
        <div className="add-to-list-wrapper">
            <div className="add-to-list-title-wrapper">
                <div className="add-to-list-title">
                    Add {symbol} to lists
                </div>
            </div>
            <form className="watchlist-stock-form" onSubmit={handleSubmit}>
                <div className="watchlist-list-wrapper">
                    <div className="watchlist-item-wrapper">
                        {
                            watchlists?.map((wl, index) =>
                            (
                                <div className="stock-watchlist-item" key={wl.id}>
                                    <div>
                                        <input type="checkbox" checked={checkedArr[index]} onChange={() => handleCheckbox(wl, index)} />
                                    </div>
                                    <div>
                                        {wl.name}({wl.Stocks.length}items)
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </div>
                <div className="watchlist-savechange-button">
                    <button>Save Changes</button>
                </div>
            </form>

        </div>
    );
}

export default AddToListModal;