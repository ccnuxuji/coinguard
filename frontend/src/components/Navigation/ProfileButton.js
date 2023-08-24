import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from 'react-redux';
import * as sessionActions from '../../store/session';
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom/cjs/react-router-dom.min";

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
      if (!ulRef.current?.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('click', closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const closeMenu = () => setShowMenu(false);

  const logout = async (e) => {
    e.preventDefault();
    await dispatch(sessionActions.logout())
      .then((res) => {
        if (res.ok) {
          history.push('/');
        }
      });

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
            <li><Link to='/orders/current'>History</Link></li>
            {/* <li><Link to='/reviews/current'>Manage Review</Link></li> */}
            <li>
              <button onClick={logout}>Log Out</button>
            </li>
          </>
        ) : (
          <>
          </>
        )}
      </div>
    </>
  );
}

export default ProfileButton;
