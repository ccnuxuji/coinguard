import "./WatchlistFormModal.css";
import { useEffect, useState } from "react";
import { useModal } from "../../context/Modal";
import { useDispatch } from "react-redux";
import { thunkCreateWatchlists, thunkGetWatchlists } from "../../store/watchlist";


function WatchlistFormModal() {
    const dispatch = useDispatch();
    const { closeModal } = useModal();
    const [name, setName] = useState("");

    const handleClickXMarker = () => {
        closeModal();
    }

    const handleCreateList = (e) => {
        e.preventDefault();
        dispatch(thunkCreateWatchlists({ name }))
            .then(dispatch(thunkGetWatchlists()))
            .then(closeModal());
    }

    return (
        <div className="create-list-title-wrapper">
            <div className="create-list-title">
                <div>Create list (no more than 10 characters)</div>
                <div onClick={handleClickXMarker} className="create-list-X_wrapper">
                    <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" /></svg>
                </div>
            </div>
            <div className="create-list-form-wrapper">
                <form className="create-list-form" onSubmit={handleCreateList}>
                    <div className="create-list-form-name">
                        <input placeholder="List Name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div className="create-list-button-wrapper">
                        <button
                            className={(name.length > 10 || name.length <= 0) ? "disabled" : ""}
                            type="submit"
                            disabled={(name.length > 10 || name.length <= 0)}
                        >Create List</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default WatchlistFormModal;