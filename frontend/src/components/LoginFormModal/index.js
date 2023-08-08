import React, { useEffect, useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./LoginForm.css";

function LoginFormModal() {
    const dispatch = useDispatch();
    const [credential, setCredential] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});
    const { closeModal } = useModal();

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors({});
        return dispatch(sessionActions.login({ credential, password }))
            .then(closeModal)
            .catch(async (res) => {
                const data = await res.json();
                if (data && data.errors) {
                    setErrors(data.errors);
                }
            });
    };

    const loginDemoUser = (e) => {
        e.preventDefault();
        setErrors({});
        return dispatch(sessionActions.login({
            credential: 'DemoUser',
            password: 'password'
        })).then(closeModal)
            .catch(async (res) => {
                const data = await res.json();
                if (data && data.errors) {
                    setErrors(data.errors);
                }
            });
    };

    useEffect(() => {

    }, [credential, password]);

    return (
        <div className="login-modal">
            <div className="login-header">
                <h1>Log in</h1>
            </div>
            <div className="login-welcome-text">
                <h3>Welcome to Airdnd</h3>
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
                    <i className="fa-light fa-envelope"></i>
                    <span>Continue with Demo User</span>
                </button>
            </div>

        </div>
    );
}

export default LoginFormModal;
