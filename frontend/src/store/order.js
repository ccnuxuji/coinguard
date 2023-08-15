import { csrfFetch } from "./csrf";
import {thunkGetPortfolio} from "./portfolio";


/***********************actions************************************** */

/*******************************thunks***************************** */
export const thunkBuyStock = (buyorder) => async (dispatch) => {
    const response = await csrfFetch("/api/orders/", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(buyorder)
    });
    const data = await response.json();
    if (response.ok) {
        dispatch(thunkGetPortfolio());
    }
    return data;
};

export const thunkSellStock = (sellorder) => async (dispatch) => {
    const response = await csrfFetch("/api/orders/", {
        method: "PUT",
        bheaders: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(sellorder)
    });
    const data = await response.json();
    if (response.ok) {
        dispatch(thunkGetPortfolio());
    }
    return data;
};

/*******************************selectors**************************** */

/******************************reducers***************************** */