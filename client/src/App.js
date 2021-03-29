import React from "react";
import { Route, BrowserRouter, Switch } from "react-router-dom";
import Main from "./pages/main";
import SignIn from "./pages/signin";
import SignUp from "./pages/signup";
import Header from "./components/Header";
import Newpost from "./pages/newpost";
import Editpost from "./pages/editpost";
import Friendrequest from "./pages/friendrequest";
import ProfilePage from "./pages/profile";
import PostDetail from "./pages/post-detail";
import axios from "axios";
import { connect } from "react-redux";
import { setCurrentDomain } from "./redux/domain/domain-actions";


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount = async () => {
    const doc = await axios.get("https://nofun.herokuapp.com/nodes/");
    if (doc) {
      const domains = [];
      doc.data.map(res => {
        domains.push(res.domain);
      })
      this.props.setCurrentDomain(domains);
    }
  }

  beforeunload = (e) => {
    e.preventDefault();
    e.returnValue = true;
  };

  render() {
    return (
      <BrowserRouter>
      <Header />
        <Switch>
          <Route exact path="/" component={Main} />
          <Route exact path="/signin" component={SignIn} />
          <Route exact path="/signup" component={SignUp} />
          <Route exact path="/friendrequest" component={Friendrequest} />
          <Route exact path="/newpost" component={Newpost} />
          <Route path="/authors/:id" component={ProfilePage} />
          <Route exact path="/posts" component={Main} />
          <Route path="/posts/edit/:id" component={Editpost} />
          <Route path="/posts/:id" component={PostDetail} />
        </Switch>
      </BrowserRouter>
    );
  }
}


const mapDispatchToProps = (dispatch) => ({
  setCurrentDomain: (domain) => dispatch(setCurrentDomain(domain)),
});

export default connect(null, mapDispatchToProps)(App);
