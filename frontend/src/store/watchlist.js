import { csrfFetch } from "./csrf";

const SET_WATCHLISTS = "watchlist/setWATCHLISTS"
const REMOVE_WATCHLIST = "watchlist/removeWATCHLIST"

/***********************actions************************************** */
const setWatchlists = (watchlists) => {
    return {
        type: SET_WATCHLISTS,
        payload: watchlists,
    };
};

const removeWatchlist = (watchlistId) => {
    return {
        type: REMOVE_WATCHLIST,
        payload: watchlistId,
    };
};

/*******************************thunks***************************** */
export const thunkGetWatchlists = () => async (dispatch) => {
    const response = await csrfFetch("/api/watchlists/current", {
        method: "GET"
    });
    const data = await response.json();
    if (response.ok) {
        dispatch(setWatchlists(data.watchlists));
    }
    return response;
};

export const thunkCreateWatchlists = (watchlist) => async (dispatch) => {
    const response = await csrfFetch("/api/watchlists/", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(watchlist)
    });
    const data = await response.json();
    if (response.ok) {
        return data;
    }
    return response;
};

export const thunkEditWatchlists = (watchlist) => async (dispatch) => {
    const response = await csrfFetch(`/api/watchlists/${watchlist.id}`, {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(watchlist)
    });
    const data = await response.json();
    if (response.ok) {
        // dispatch(thunkGetWatchlists());
        return data;
    }
    return response;
};

export const thunkDeleteWatchlists = (watchlist) => async (dispatch) => {
    const response = await csrfFetch(`/api/watchlists/${watchlist.id}`, {
        method: "DELETE"
    });
    const data = await response.json();
    if (response.ok) {
        dispatch(removeWatchlist(watchlist.id));
        return data;
    }
    return response;
};

export const thunkAddStockToWatchlists = (symbol, watchlistIds) => async (dispatch) => {
    const response = await csrfFetch(`/api/watchlists/stock/${symbol}`, {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({watchlistIds})
    });
    const data = await response.json();
    if (response.ok) {
        dispatch(thunkGetWatchlists());
        return data;
    }
    return response;
};

/*******************************selectors**************************** */
export const getWatchlists = (state) => Object.values(state.watchlist.watchlists);

/******************************reducers***************************** */
const initialState = { watchlists: {} };

const watchlistReducer = (state = initialState, action) => {
    let newState;
    switch (action.type) {
        case SET_WATCHLISTS:
            newState = {...state};
            newState.watchlists = {};
            action.payload.forEach((watchlist) => {
                newState.watchlists[watchlist.id] = watchlist;
            });
            return newState;
        case REMOVE_WATCHLIST:
            newState = {...state};
            delete newState.watchlists[action.payload];
            return newState;
        default:
            return state;
    }
};

export default watchlistReducer;