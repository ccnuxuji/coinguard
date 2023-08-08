import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from 'react-redux';
import * as sessionActions from '../../store/session';
import OpenModalMenuItem from './OpenModalMenuItem';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';
import { Link, useHistory } from "react-router-dom";

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();
  const history = useHistory();

  const openMenu = () => {
    if (showMenu) return;
    setShowMenu(true);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (!ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('click', closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const closeMenu = () => setShowMenu(false);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
    closeMenu();
    history.push('/');
  };

  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

  return (
    <>
      <div className="nav-profile-createSpot">
        {/* {user &&
          <Link to='/spots/new' className="create-spot-text">Create a New Spot</Link>
        } */}
        <button 
          onClick={openMenu}
          className="navigtion-button-wrapper">
          <i className="fa-solid fa-bars"></i>
          <i className="fas fa-user-circle" />
        </button>
      </div>

      <div className={ulClassName} ref={ulRef}>
        {user ? (
          <>
            <li>Hello, {user.firstName}</li>
            <li>{user.email}</li>
            {/* <li><Link to='/spots/current'>Manage Spot</Link></li>
            <li><Link to='/reviews/current'>Manage Review</Link></li> */}
            <li>
              <button onClick={logout}>Log Out</button>
            </li>
          </>
        ) : (
          <>
            <OpenModalMenuItem
              itemType="list"
              itemText="Log In"
              onItemClick={closeMenu}
              modalComponent={<LoginFormModal />}
            />
            <OpenModalMenuItem
              itemType='list'
              itemText="Sign Up"
              onItemClick={closeMenu}
              modalComponent={<SignupFormModal />}
            />
          </>
        )}
      </div>
    </>
  );
}

export default ProfileButton;
