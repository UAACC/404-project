import React from 'react';
import { Route, BrowserRouter, Switch } from "react-router-dom";
import { connect } from "react-redux";
import Main from "./pages/main";
import SignIn from "./pages/signin"
import SignUp from "./pages/signup"

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  beforeunload = (e) => {
    e.preventDefault();
    e.returnValue = true;
  };

  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={Main} />
          <Route exact path="/signin" component={SignIn} />
          <Route exact path="/signup" component={SignUp} />
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;
