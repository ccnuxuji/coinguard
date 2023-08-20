import { useEffect, useState } from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import ProfileButton from './ProfileButton';
import logoImg from '../../assets/images/leaf.png';
import './Navigation.css';
import { thunkSearchStockByNameAndSymbol } from '../../store/stock';

function Navigation({ isLoaded }) {
    const dispatch = useDispatch();
    const sessionUser = useSelector(state => state.session.user);
    const history = useHistory();
    const [keyword, setKeyword] = useState("");

    const onClickLogin = (e) => {
        e.preventDefault();
        history.push('/login');
    }

    const onClickSignup = (e) => {
        e.preventDefault();
        history.push('/signup');
    }

    const handleStockSearch = (e) => {
        e.preventDefault();
        dispatch(thunkSearchStockByNameAndSymbol(keyword))
            .then(history.push('/search'));
    }

    return (
        <div className='nav-bar-wrapper'>
            {/* logo */}
            <NavLink className='nav-bar-logo' to={window.location.pathname !== '/' ? "/portfolio" : "/"}>
                <img className='logo-img' alt='logo' src={logoImg} />
                <div className='logo-text'>CoinGuard</div>
            </NavLink>

            {/* search bar */}
            {sessionUser && (
                <div className='search-bar'>
                    <form onSubmit={handleStockSearch}>
                        <input type="text" id="search" name="search" placeholder="Search stock..."
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                        />
                        <button><i className="fas fa-search"></i></button>
                    </form>
                </div>
            )}


            {!sessionUser && (
                <div className='login-signup-buttons'>
                    <button className='home-login-button' onClick={onClickLogin}>Log in</button>
                    <button className='home-signup-button' onClick={onClickSignup}>Sign up</button>
                </div>

            )}


            {/* profile button */}

            {sessionUser && (
                <div className='portfolio-profileButton-wrapper'>
                    <NavLink className="nav-to-portfolio" to="/portfolio">Portfolio</NavLink>
                    <ProfileButton user={sessionUser} />
                </div>
            )}
        </div>

    );
}

export default Navigation;
