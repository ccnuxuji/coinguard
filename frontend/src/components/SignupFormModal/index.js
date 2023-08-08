import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import * as sessionActions from "../../store/session";
import "./SignupForm.css";

function SignupFormModal() {
    const dispatch = useDispatch();
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errors, setErrors] = useState({});
    const [disable, setDisable] = useState(true);
    const { closeModal } = useModal();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (password === confirmPassword) {
            setErrors({});
            return dispatch(
                sessionActions.signup({
                    email,
                    username,
                    firstName,
                    lastName,
                    password,
                })
            )
                .then(closeModal)
                .catch(async (res) => {
                    const data = await res.json();
                    if (data && data.errors) {
                        setErrors(data.errors);
                    }
                });
        }
        return setErrors({
            confirmPassword: "Confirm Password field must be the same as the Password field"
        });
    };

    useEffect(() => {
        if (firstName.length > 0 && lastName.length > 0 && email.length > 0 && username.length > 0 && password.length > 0 && confirmPassword.length > 0) {
            setDisable(false);
        }
    }, [firstName, lastName, email, username, password, confirmPassword]);

    return (
        <div className="signUp-modal">
            <div className="signup-header">
                <h1>Sign up</h1>
            </div>
            <div className="signup-form">
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="First Name"
                        required
                    />
                    {errors.firstName && <p>{errors.firstName}</p>}
                    <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Last Name"
                        required
                    />
                    {errors.lastName && <p>{errors.lastName}</p>}
                    <input
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                        required
                    />
                    {errors.email && <p>{errors.email}</p>}
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Username"
                        required
                    />
                    {errors.username && <p>{errors.username}</p>}
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="password"
                        required
                    />
                    {errors.password && <p>{errors.password}</p>}
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm Password"
                        required
                    />
                    {errors.confirmPassword && (
                        <p>{errors.confirmPassword}</p>
                    )}
                    <div className="signup-submit-button-div">
                        <button
                            className={disable ? "disabled" : ""}
                            type="submit"
                            disabled={disable}
                        >Sign Up</button>
                    </div>

                </form>
            </div>

        </div>
    );
}

export default SignupFormModal;
