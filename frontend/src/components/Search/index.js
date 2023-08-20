import "./search.css";
import Navigation from "../Navigation";
import { useSelector, useDispatch } from 'react-redux';
import { getStockSearchData } from "../../store/stock";
import { NavLink } from "react-router-dom/cjs/react-router-dom.min";


function Search({ isLoaded }) {
    const searchdata = useSelector(getStockSearchData);

    return (
        <div>
            <div className="navbar">
                <Navigation isLoaded={isLoaded} />
            </div>
            <div className="search-result-main-wrapper">
                <div className="search-result-main">
                    <h3>{searchdata.length} search results:</h3>
                    {
                        searchdata?.map(stock => (
                            <NavLink className="search-result-item" to={`/stock/${stock.symbol}`}>
                                <div className="search-company-name">Company name : {stock.name} </div>
                                <div className="search-stock-symbol">Stock symbol : {stock.symbol} </div>
                            </NavLink>
                        ))
                    }
                </div>
            </div>
        </div>
    );
}

export default Search;