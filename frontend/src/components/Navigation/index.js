import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import logoImg from '../../assets/images/leaf.png';
import './Navigation.css';

function Navigation({ isLoaded }) {
    const sessionUser = useSelector(state => state.session.user);

    return (
        <div className='nav-bar-wrapper'>
            {/* logo */}
            <NavLink className='nav-bar-logo' to="/">
                <img className='logo-img' alt='logo' src={logoImg} />
                <div className='logo-text'>CoinGuard</div>
            </NavLink>

            {/* search bar
            <div className='search-bar'>
                <input type="text" id="search" name="search" placeholder="Search..." />
            </div> */}

            {/* profile button */}
            
            {isLoaded && (
                <ProfileButton user={sessionUser} />
            )}
        </div>

    );
}

export default Navigation;
