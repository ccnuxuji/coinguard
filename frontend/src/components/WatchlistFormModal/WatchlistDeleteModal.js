import "./WatchlistDeleteModal.css";
import { useModal } from "../../context/Modal";
import { useDispatch } from "react-redux";
import { thunkDeleteWatchlists, thunkGetWatchlists } from "../../store/watchlist";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";


function WatchlistDeleteModal({ watchlist }) {
    const history = useHistory();
    const { closeModal } = useModal();
    const dispatch = useDispatch();

    const handleCancel = (e) => {
        e.preventDefault();
        closeModal();
    }

    const handleDelete = (e) => {
        e.preventDefault();
        dispatch(thunkDeleteWatchlists(watchlist))
            .then(dispatch(thunkGetWatchlists()))
            .then(closeModal())
            .then(history.push("/portfolio"));
    }

    return (
        <div className="delete-modal-wrapper">
            <div className="delete-modal-title">
                <h1>Confirm Delete</h1>
            </div>
            <div className="delete-confirm-text">
                <p>Are you sure you want to delete {watchlist.name} ?</p>
            </div>
            <div className="delete-modal-button-wrapper">
                <button className="delete-button" onClick={handleDelete}>Yes (Delete it)</button>
                <button className="cancelDelete-button" onClick={handleCancel}>No (Keep it)</button>
            </div>

        </div>
    );
}

export default WatchlistDeleteModal;
