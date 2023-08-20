const SET_STOCK = "stock/setSTOCK";
const SET_STOCK7 = "stock/setSTOCK7";
const SET_STOCK_DETAIL = "stock/setSTOCKDETAIL";
const SET_SEARCH_DATA = "stock/setSEARCHDATA";
const SET_GENERAL_NEWS = "stock/setGENERALNEWS";
const SET_COMPANY_NEWS = "stock/setCOMPANYNEWS";
const SET_MINICHART_DATA = "stock/setMINICHARTDATA";
const apiKey = process.env.REACT_APP_FMP_API_KEY;
const searchAPIkey = process.env.REACT_APP_FMP_SEARCH_API_KEY;
const finnhubKey = process.env.REACT_APP_FINNHUB_API_KEY;


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

const setSearchData = (searchData) => {
    return {
        type: SET_SEARCH_DATA,
        payload: searchData,
    };
};

const setGeneralNews = (generalnews) => {
    return {
        type: SET_GENERAL_NEWS,
        payload: generalnews,
    };
}

const setCompanyNews = (companynews) => {
    return {
        type: SET_COMPANY_NEWS,
        payload: companynews,
    };
}

const setMinichartStockData = (stocksdata) => {
    return {
        type: SET_MINICHART_DATA,
        payload: stocksdata,
    };
}

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

export const thunkSearchStockByNameAndSymbol = (keyword) => async (dispatch) => {
    const response = await fetch(
        `https://financialmodelingprep.com/api/v3/search?query=${keyword}&limit=10&exchange=NASDAQ&apikey=${searchAPIkey}`,
        {
            method: "GET"
        }
    );
    const data = await response.json();
    if (response.ok) {
        dispatch(setSearchData(data));
    }
    return response;
};

export const thunkGetGeneralNews = () => async (dispatch) => {
    const response = await fetch(
        `https://finnhub.io/api/v1/news?category=general&token=${finnhubKey}`,
        {
            method: "GET"
        }
    );
    const data = await response.json();
    if (response.ok) {
        dispatch(setGeneralNews(data.slice(0, 10)));
    }
    return response;
};

export const thunkGetCompanyNews = (stocksymbol) => async (dispatch) => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1; // Months are zero-indexed, so add 1
    const day = today.getDate();
    const formattedMonth = month < 10 ? `0${month}` : month;
    const formattedDay = day < 10 ? `0${day}` : day;
    // Creating the final date string in the format: yyyy-mm-dd
    const todayDateString = `${year}-${formattedMonth}-${formattedDay}`;

    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const year1 = yesterday.getFullYear();
    const month1 = yesterday.getMonth() + 1; // Months are zero-indexed, so add 1
    const day1 = yesterday.getDate();
    const formattedMonth1 = month1 < 10 ? `0${month1}` : month1;
    const formattedDay1 = day1 < 10 ? `0${day1}` : day1;
    // Creating the final date string in the format: yyyy-mm-dd
    const yesterdayDateString = `${year1}-${formattedMonth1}-${formattedDay1}`;

    const response = await fetch(
        `https://finnhub.io/api/v1/company-news?symbol=${stocksymbol}&from=${yesterdayDateString}&to=${todayDateString}&token=${finnhubKey}`
    );
    const data = await response.json();
    if (response.ok) {
        dispatch(setCompanyNews(data));
    }
    return response;
};

export const thunkGetMinichartStockData = (stocklist) => async (dispatch) => {
    const currenttime = new Date();
    let currentTimestamp = Date.now();
    const twentyFourHoursAgo = new Date();
    twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);
    

    if (currenttime.getDay() === 0 || currenttime.getDay() === 6) {
        twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 72);
        currenttime.setHours(currenttime.getHours() - 48);
    }

    const timestampTwentyFourHoursAgo = Math.floor(twentyFourHoursAgo.getTime() / 1000);
    currentTimestamp = Math.floor(currentTimestamp / 1000);
    const result = {};
    stocklist.forEach(async stocksymbol => {
        const response = await fetch(`https://finnhub.io/api/v1/stock/candle?symbol=${stocksymbol}&resolution=15&from=${timestampTwentyFourHoursAgo}&to=${currentTimestamp}&token=${finnhubKey}`);
        const data = await response.json();
        if (response.ok) {
            result[stocksymbol] = data;
        }
    });

    await dispatch(setMinichartStockData(result));
    return result;
};


/*******************************selectors**************************** */
export const getStockHistoryData = (state) => state.stock.historydata;
export const getStockHistoryData7 = (state) => state.stock.historydata7;
export const getStockDetailData = (state) => state.stock.stockdetail;
export const getStockSearchData = (state) => state.stock.searchdata;
export const getGeneralNews = (state) => state.stock.generalnews;
export const getCompanyNews = (state) => state.stock.companynews;
export const getMiniChartData = (state) => state.stock.minichartdata;

/******************************reducers***************************** */
const initialState = { historydata: [], stockdetail: {}, historydata7: [], searchdata: [], 
                       generalnews: [], companynews: [], stocknews: [], minichartdata: {} };

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
        case SET_SEARCH_DATA:
            newState = { ...state };
            newState.searchdata = action.payload
            return newState;
        case SET_GENERAL_NEWS:
            newState = { ...state };
            newState.generalnews = action.payload
            return newState;
        case SET_COMPANY_NEWS:
            newState = { ...state };
            newState.companynews = action.payload
            return newState;
        case SET_MINICHART_DATA:
            newState = { ...state };
            newState.minichartdata = action.payload
            return newState;
        default:
            return state;
    }
};

export default stockReducer;
