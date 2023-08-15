import { useEffect, useState } from "react";
import "./TransferFormModal.css";
import { useModal } from "../../context/Modal";
import { getportfolio, thunkWithdrawMoney } from "../../store/portfolio";
import { useDispatch, useSelector } from "react-redux";


function WithdrawModal() {
    const dispatch = useDispatch();
    const { closeModal } = useModal();
    const [amount, setAmount] = useState("");
    const [errors, setErrors] = useState({});
    const portfolio = useSelector(getportfolio);


    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(thunkWithdrawMoney({ amount }))
        .then(closeModal)
    };

    useEffect(() => {

    }, [amount]);

    return (

        <div className="transfer-modal">
            <div className="transfer-header">
                <h2>Transfer money</h2>
            </div>

            <div className="transfer-form">
                <form onSubmit={handleSubmit}>
                    <div className="transfer-amount-wrapper">
                        <label htmlFor="transfer-amount">Amount</label>
                        <input
                            id="transfer-amount"
                            type="text"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="$0.00"
                            required
                        />
                    </div>
                    <div className="transfer-from-wrapper">
                        <label htmlFor="dropdown">From</label>
                        <select id="dropdown" >
                            <option value="option1">Borkerage account</option>
                        </select>
                    </div>
                    <div className="transfer-to-wrapper">
                        <label htmlFor="dropdown">To</label>
                        <select id="dropdown" >
                            <option value="option1">Checking account</option>
                        </select>
                    </div>
                    <div className="transfer-frequency-wrapper">
                        <label htmlFor="dropdown">Frequency</label>
                        <select id="dropdown" >
                            <option value="option1">Just once</option>
                        </select>
                    </div>
                    {errors.amount && (
                        <p>{errors.amount}</p>
                    )}
                    <div className="deposit-submit-button-div">
                        <div className="daily-transfer-limit">Avaliable balance is ${portfolio?.cashValue.toFixed(2)}</div>
                        <button
                            className={(amount < 1 || amount > portfolio?.cashValue) ? "disabled" : ""}
                            type="submit"
                            disabled={amount < 1 || amount > portfolio?.cashValue}
                        >Review transfer</button>
                    </div>
                </form>
            </div>

        </div>
    );
}

export default WithdrawModal;
