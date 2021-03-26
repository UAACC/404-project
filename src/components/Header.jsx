import React from "react";
import { connect } from "react-redux";
import { setCurrentUser } from "../redux/user/useractions";
import axios from "axios";

class Header extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      search: ""
    }
  }
  

  handleLogOut = () => {
    this.props.setCurrentUser(false);
  };

  handleSearch = async (e) => {
    e.preventDefault();
    const { search } = this.state;
    const doc = await axios.get("/api/authors/");
    let searched = false;
    for (let author of doc.data) {
      console.log(author);
      if (search === author.username){
        searched = true;
        window.location = "/authors/" + author.id + "/";
      }
    }
    if (!searched) window.alert("No author found!");
  }

  renderHeader = () => {
    const { currentUser } = this.props;
    switch (currentUser) {
      case null:
        return null;
      case false:
        return (
          <li className="nav-item">
            <a className="nav-link active" aria-current="page" onMouseOver="cursor" href="/signin">
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
              onMouseOver="cursor"
              onClick={this.handleLogOut}
            >
              log out
            </a>
          </li>
        );
    }
  };

  render() {
    const { search } = this.state;
    const { currentUser } = this.props;
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
                <a
                  className="nav-link active"
                  aria-current="/post/create"
                  href="/newpost"
                >
                  create post
                </a>
              </li>
              {
                currentUser ? 
                <li className="nav-item">
                <a
                  className="nav-link active"
                  aria-current="page"
                  href={"/authors/" + currentUser.id + "/"}
                >
                  my profile
                </a>
              </li>
              : null
              }
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
                value={search}
                onChange={e=>this.setState({search: e.target.value})}
              ></input>
              <button className="btn btn-outline-light" type="submit" onClick={this.handleSearch}>
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
