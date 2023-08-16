import Navigation from "../Navigation";
import "./LandingPage.css";
import { useParams, useHistory } from 'react-router-dom';
import financial from "../../assets/images/finance.jpg";
import { useEffect } from "react";
import { useSelector } from 'react-redux';

function LandingPage({ isLoaded }) {
    const history = useHistory();
    const sessionUser = useSelector(state => state.session.user);

    useEffect(() => {
        // if (isLoaded && sessionUser) {
        //     console.log("I am here!")
        //     history.push('/portfolio');
        // }
    }, [isLoaded]);

    return (
        <>
            <div className="navbar-homepage">
                <Navigation isLoaded={isLoaded} />
            </div>
            <div className="landing-main">
                <img alt="" src={financial}/>
            </div>
        </>
    );
}

export default LandingPage;