import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Provider } from "react-redux";
import jwt_decode from "jwt-decode";

import "./App.css";
import store from "./store";
import Navbar from "./components/layout/navbar";
import Landing from "./components/layout/landing";
import Footer from "./components/layout/footer";
import Register from "./components/auth/register";
import Login from "./components/auth/login";
import Dashboard from "./components/dashboard/dashboard";
import CreateProfile from "./components/create_profile/createProfile";
import PrivateRoute from "./components/common/PrivateRoute";

import setAuthToken from "./utility/setAuthToken";
import { setCurrentUser, logoutUser } from "./actions/authActions";
import { clearCurrentProfile } from "./actions/profileActions";

if (localStorage.jwtToken) {
  //alert("yolo");
  // Configure token to be required for any protected route access
  setAuthToken(localStorage.jwtToken);

  const decoded = jwt_decode(localStorage.jwtToken);

  // Dispatch login user
  store.dispatch(setCurrentUser(decoded));

  if (jwt_decode(localStorage.jwtToken).exp < Date.now() / 1000) {
    store.dispatch(logoutUser());

    // Clear user profile
    store.dispatch(clearCurrentProfile());

    // eslint-disable-next-line anchor-is-valid
    window.location.href = "/login";
  }
}

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <div className="App">
            <Navbar />
            <Route exact path="/" component={Landing} />
            <div className="container">
              <Route exact path="/register" component={Register} />
              <Route exact path="/login" component={Login} />
              <Switch>
                <PrivateRoute exact path="/dashboard" component={Dashboard} />
              </Switch>
              <Switch>
                <PrivateRoute
                  exact
                  path="/create-profile"
                  component={CreateProfile}
                />
              </Switch>
            </div>
            <Footer />
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
