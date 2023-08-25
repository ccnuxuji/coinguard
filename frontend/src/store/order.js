import { csrfFetch } from "./csrf";
import { thunkGetPortfolio } from "./portfolio";

const SET_ORDERS = "set/ORDERS";
const SET_TRANSACTIONS = "set/TRANSACTIONS"

/***********************actions************************************** */
const setOrders = (orders) => {
    return {
        type: SET_ORDERS,
        payload: orders,
    };
};

const setTransactions = (transactions) => {
    return {
        type: SET_TRANSACTIONS,
        payload: transactions,
    };
};

/*******************************thunks***************************** */
export const thunkGetOrders = () => async (dispatch) => {
    const response = await csrfFetch("/api/orders/current");
    const data = await response.json();
    if (response.ok) {
        dispatch(setOrders(data.orders));
    }
    return response;
};
export const thunkGetTransactions = () => async (dispatch) => {
    const response = await csrfFetch("/api/transactions/current");
    const data = await response.json();
    if (response.ok) {
        dispatch(setTransactions(data.transactions));
    }
    return response;
};

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
        await dispatch(thunkGetPortfolio());
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
        await dispatch(thunkGetPortfolio());
    }
    return data;
};

/*******************************selectors**************************** */
export const getOrders = (state) => state.order.orders;
export const getTransactions = (state) => state.order.transactions;

/******************************reducers***************************** */
const initialState = { orders: [], transactions: [] };

const orderReducer = (state = initialState, action) => {
    let newState;
    switch (action.type) {
        case SET_ORDERS:
            newState = { ...state };
            newState.orders = action.payload;
            return newState;
        case SET_TRANSACTIONS:
            newState = { ...state };
            newState.transactions = action.payload;
            return newState;
        default:
            return state;
    }
};

export default orderReducer;