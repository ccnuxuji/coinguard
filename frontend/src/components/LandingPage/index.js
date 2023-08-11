import Navigation from "../Navigation";

function LandingPage({ isLoaded }) {
    return (
        <>
            <div className="navbar">
                <Navigation isLoaded={isLoaded} />
            </div>
        </>
    );
}

export default LandingPage;