import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Switch, Route } from "react-router-dom";
import * as sessionActions from "./store/session";
import LandingPage from "./components/LandingPage";
import Portfolio from "./components/Portfolio";
import StockDetail from "./components/StockDetail";
import LoginPage from "./components/LoginPage";
import SignupFormModal from "./components/SignupFormModal";
import Search from "./components/Search";


function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser())
      .then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <Switch>  
        <Route exact path="/"  render={() => <LandingPage isLoaded={isLoaded} />} />
        <Route exact path="/login"  render={() => <LoginPage />} />
        <Route exact path="/search" render={() => <Search isLoaded={isLoaded}/>} />
        <Route exact path="/signup"  render={() => <SignupFormModal />} />
        <Route exact path="/portfolio" render={() => <Portfolio isLoaded={isLoaded} />} />
        <Route exact path="/stock/:stocksymbol" render={() => <StockDetail isLoaded={isLoaded} />} />
      </Switch>
    </>
  );
}

export default App;