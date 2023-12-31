import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import sessionReducer from "./session";
import portfolioReducer from "./portfolio";
import watchlistReducer from "./watchlist";
import stockReducer from "./stock";
import orderReducer from "./order";


const rootReducer = combineReducers({
  session: sessionReducer,
  portfolio: portfolioReducer,
  watchlist: watchlistReducer,
  stock: stockReducer,
  order: orderReducer
});

let enhancer;

if (process.env.NODE_ENV === "production") {
  enhancer = applyMiddleware(thunk);
} else {
  const logger = require("redux-logger").default;
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  enhancer = composeEnhancers(applyMiddleware(thunk, logger));
}

const configureStore = (preloadedState) => {
  return createStore(rootReducer, preloadedState, enhancer);
};

export default configureStore;
