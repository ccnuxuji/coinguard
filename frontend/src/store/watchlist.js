import { csrfFetch } from "./csrf";

const SET_WATCHLISTS = "watchlist/setWATCHLISTS"

/***********************actions************************************** */
const setWatchlists = (watchlists) => {
    return {
        type: SET_WATCHLISTS,
        payload: watchlists,
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

/*******************************selectors**************************** */
export const getWatchlists = (state) => Object.values(state.watchlist.watchlists);

/******************************reducers***************************** */
const initialState = { watchlists: {} };

const watchlistReducer = (state = initialState, action) => {
    let newState;
    switch (action.type) {
        case SET_WATCHLISTS:
            newState = {...state};
            action.payload.forEach((watchlist) => {
                newState.watchlists[watchlist.id] = watchlist;
            });

            return newState;
        default:
            return state;
    }
};

export default watchlistReducer;