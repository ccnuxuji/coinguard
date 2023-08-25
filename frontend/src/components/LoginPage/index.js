import "./LoginPage.css";
import React, { useEffect, useState } from "react";
import * as sessionActions from "../../store/session";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from 'react-router-dom';
import { useModal } from "../../context/Modal";
import loginimg from "../../assets/images/login.png";
import googleButton from '../../assets/images/btn_google_signin_dark_pressed_web.png';
import { csrfFetch } from "../../store/csrf";


function navigate(url) {
    window.location.href = url;
}

function LoginPage() {
    const dispatch = useDispatch();
    const history = useHistory();
    const [credential, setCredential] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});
    const { closeModal } = useModal();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        await dispatch(sessionActions.login({ credential, password }))
            .then(async (res) => {
                if (res.ok) {
                    history.push(`/portfolio`);
                }
            })
            .catch(async (res) => {
                const data = await res.json();
                if (data && data.errors) {
                    setErrors(data.errors);
                }
            });

    };

    const loginDemoUser = async (e) => {
        e.preventDefault();
        setErrors({});
        await dispatch(sessionActions.login({
            credential: 'DemoUser',
            password: 'password'
        })).then(closeModal)
            .catch(async (res) => {
                const data = await res.json();
                if (data && data.errors) {
                    setErrors(data.errors);
                }
            });
        history.push(`/portfolio`);
    };

    const loginThroughGoogle = async () => {
        const response = await csrfFetch('/api/session/googleauth', { method: 'post' });
        const data = await response.json();
        console.log(data);
        navigate(data.url);
    };


    return (
        <div className="login-page-wrapper">
            <div className="login-image-wrapper">
                <img alt="" src={loginimg} />
            </div>
            <div className="login-form-wrapper">
                <div className="login-modal">
                    <div className="login-header">
                        <h1>Log in</h1>
                    </div>
                    <div className="login-welcome-text">
                        <h3>Welcome to CoinGuard</h3>
                    </div>
                    <div className="login-form">
                        <form onSubmit={handleSubmit}>
                            <div>
                                <input
                                    type="text"
                                    value={credential}
                                    onChange={(e) => setCredential(e.target.value)}
                                    placeholder="Email or Username"
                                    required
                                />
                            </div>
                            <div>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Password"
                                    required
                                />
                            </div>
                            {errors.credential && (
                                <p>{errors.credential}</p>
                            )}
                            <div className="login-submit-button-div">
                                <button
                                    className={(credential.length < 4 || password.length < 6) ? "disabled" : ""}
                                    type="submit"
                                    disabled={credential.length < 4 || password.length < 6}
                                >Log In</button>
                            </div>
                        </form>
                    </div>

                    <div className="orline-divider">
                        <div className="div-line-1"></div>
                        <div className="or-word">or</div>
                        <div className="div-line-2"></div>
                    </div>

                    <div className="login-all-items">
                        <button className="demouser" onClick={loginDemoUser}>
                            <span>Continue with Demo User</span>
                        </button>
                        <div className="google-login" onClick={loginThroughGoogle}>
                            <img className="btn-auth-img" src={googleButton} alt='google sign in' />
                        </div>
                    </div>


                </div>
            </div>
        </div>
    );
}

export default LoginPage;