import React from "react";
import Profile from "./ProfileComponent.jsx";
import { connect } from "react-redux";
import { setCurrentUser } from "../redux/user/useractions";

class Header extends React.Component {
  handleLogOut = () => {
    this.props.setCurrentUser(false);
  };

  renderHeader = () => {
    const { currentUser } = this.props;
    switch (currentUser) {
      case null:
        return null;
      case false:
        return (
          <li className="nav-item">
            <a className="nav-link active" aria-current="page" href="/signin">
              sign in
            </a>
          </li>
        );
      default:
        return (
          <li className="nav-item">
            <a
              className="nav-link active"
              aria-current="page"
              onClick={this.handleLogOut}
            >
              log out
            </a>
          </li>
        );
    }
  };

  render() {
    return (
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <div className="container-fluid">
          <a className="navbar-brand" href="/">
            Socialdistribution
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <a className="nav-link active" aria-current="page" href="/">
                  public
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link active"
                  aria-current="/post/create"
                  href="/newpost"
                >
                  create post
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link active"
                  aria-current="page"
                  href="/profile"
                >
                  my profile
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link active"
                  aria-current="page"
                  href="/friendrequest"
                >
                  Request Inbox
                </a>
              </li>
              {this.renderHeader()}
            </ul>
            <form className="d-flex">
              <input
                className="form-control me-2"
                type="search"
                placeholder="search author"
                aria-label="Search"
              ></input>
              <button className="btn btn-outline-light" type="submit">
                search author
              </button>
            </form>
          </div>
        </div>
      </nav>
    );
  }
}

const mapStateToProps = (state) => ({
  currentUser: state.user.currentUser,
});

const mapDispatchToProps = (dispatch) => ({
  setCurrentUser: (user) => dispatch(setCurrentUser(user)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Header);
