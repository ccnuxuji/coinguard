import React, { useEffect } from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import logoImg from '../../assets/images/leaf.png';
import './Navigation.css';

function Navigation({ isLoaded }) {
    const sessionUser = useSelector(state => state.session.user);
    const history = useHistory();

    const onClickLogin = (e) => {
        e.preventDefault();
        history.push('/login');
    }

    const onClickSignup = (e) => {
        e.preventDefault();
        history.push('/signup');
    }

    return (
        <div className='nav-bar-wrapper'>
            {/* logo */}
            <NavLink className='nav-bar-logo' to="/portfolio">
                <img className='logo-img' alt='logo' src={logoImg} />
                <div className='logo-text'>CoinGuard</div>
            </NavLink>

            {/* search bar */}
            {sessionUser && (
                <div className='search-bar'>
                    <form>
                        <input type="text" id="search" name="search" placeholder="Search..." />
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
                <ProfileButton user={sessionUser} />
            )}
        </div>

    );
}

export default Navigation;
