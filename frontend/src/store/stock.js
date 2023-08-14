const SET_STOCK = "stock/setSTOCK";
const SET_STOCK7 = "stock/setSTOCK7";
const SET_STOCK_DETAIL = "stock/setSTOCKDETAIL";
const apiKey = process.env.REACT_APP_FMP_API_KEY;

/***********************actions************************************** */
const setStockHistory = (stockhistorydata) => {
    return {
        type: SET_STOCK,
        payload: stockhistorydata,
    };
};

const setStockHistory7 = (stockhistorydata7) => {
    return {
        type: SET_STOCK7,
        payload: stockhistorydata7,
    };
};

const setStockDetail = (stockdetaildata) => {
    return {
        type: SET_STOCK_DETAIL,
        payload: stockdetaildata,
    };
};

/*******************************thunks***************************** */
export const thunkGetStockInterval = (timeInterval, stockSymbol) => async (dispatch) => {
    const response = await fetch(
        `https://financialmodelingprep.com/api/v3/historical-chart/${timeInterval}/${stockSymbol}?apikey=${apiKey}`,
        {
            method: "GET"
        }
    );
    const data = await response.json();
    if (response.ok) {
        const currenttime = new Date();
        const newdata = data?.filter(obj => {
            const tmpDate = new Date(obj.date);
            if (currenttime.getDay() === 0 || currenttime.getDay() === 6) {
                return tmpDate.getDay() === 5 && (Math.abs(currenttime.getDate() - tmpDate.getDate()) < 3 || Math.abs(currenttime.getDate() - tmpDate.getDate()) > 20);
            } else {
                return currenttime.getDate() === tmpDate.getDate();
            }
        }).reverse();
        const newdata7 = data?.slice(0, 547).reverse();
        dispatch(setStockHistory(newdata));
        dispatch(setStockHistory7(newdata7));
    }
    return response;
};

export const thunkGetCompanyInformation = (stockSymbol) => async (dispatch) => {
    const response = await fetch(
        `https://financialmodelingprep.com/api/v3/profile/${stockSymbol}?apikey=${apiKey}`,
        {
            method: "GET"
        }
    );
    const data = await response.json();
    if (response.ok) {
        dispatch(setStockDetail(data[0]));
    }
    return response;
};

/*******************************selectors**************************** */
export const getStockHistoryData = (state) => state.stock.historydata;
export const getStockHistoryData7 = (state) => state.stock.historydata7;
export const getStockDetailData = (state) => state.stock.stockdetail;

/******************************reducers***************************** */
const initialState = { historydata: [], stockdetail: {}, historydata7: [] };

const stockReducer = (state = initialState, action) => {
    let newState;
    switch (action.type) {
        case SET_STOCK:
            newState = { ...state };
            newState.historydata = action.payload
            return newState;
        case SET_STOCK7:
            newState = { ...state };
            newState.historydata7 = action.payload
            return newState;
        case SET_STOCK_DETAIL:
            newState = { ...state };
            newState.stockdetail = action.payload
            return newState;
        default:
            return state;
    }
};

export default stockReducer;
