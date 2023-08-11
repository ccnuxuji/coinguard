import { csrfFetch } from "./csrf";

const SET_PORTFOLIO = "portfolio/setPORTFOLIO"

/***********************actions************************************** */
const setPortfolio = (portfolio) => {
    return {
        type: SET_PORTFOLIO,
        payload: portfolio,
    };
};

/*******************************thunks***************************** */
export const thunkGetPortfolio = () => async (dispatch) => {
    const response = await csrfFetch("/api/portfolios/current", {
        method: "GET"
    });
    const data = await response.json();
    if (response.ok) {
        dispatch(setPortfolio(data));
    }
    return response;
};

export const thunkDepositMoney = (deposit) => async (dispatch) => {
    const response = await csrfFetch("/api/portfolios/deposit", {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(deposit)
    });
    const data = await response.json();
    if (response.ok) {
        dispatch(thunkGetPortfolio());
    }
    return response;
};

export const thunkWithdrawMoney = (withdraw) => async (dispatch) => {
    const response = await csrfFetch("/api/portfolios/withdraw", {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(withdraw)
    });
    const data = await response.json();
    if (response.ok) {
        dispatch(thunkGetPortfolio());
    }
    return response;
};

/*******************************selectors**************************** */
export const getportfolio = (state) => state.portfolio.portfolio;

/******************************reducers***************************** */
const initialState = { portfolio: null };

const portfolioReducer = (state = initialState, action) => {
    let newState;
    switch (action.type) {
        case SET_PORTFOLIO:
            newState = Object.assign({}, state);
            newState.portfolio = action.payload;
            return newState;
        default:
            return state;
    }
};

export default portfolioReducer;