import React from "react";
import { connect } from "react-redux";
import { setCurrentUser } from "../redux/user/useractions";
import axios from "axios";
import "./style/header.css";


class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      search: "",
    };
  }

  handleLogOut = () => {
    this.props.setCurrentUser(false);
  };

  handleSearch = async (e) => {
    e.preventDefault();
    const { search } = this.state;

    let authors = [];
    const requests = this.props.domains?.map(domain => {
      const config = {
        headers: {
          'Authorization': domain.auth,
        }
      }
      return axios.get("https://" + domain.domain + '/all-authors/', config)
    });
    const resArray = await Promise.all(requests);

    resArray.map(doc => {
      authors = authors.concat(doc.data);
    })
    
    let searched = false;
    for (let author of authors) {
      if (search === author.displayName) {
        searched = true;
        const domain = author.id.split("/")[2];
        const authorId = author.id.split("/")[4];
        window.location = "/authors/"  + domain + "/" + authorId + "/";
      }
    }

    if (!searched) window.alert("No author found. Please try again!");
  };

  renderHeader = () => {
    const { currentUser } = this.props;
    switch (currentUser) {
      case null:
        return null;
      case false:
        return (
          <li className="nav-item">
            <a
              className="nav-link active"
              aria-current="page"
              onMouseOver="cursor"
              href="/signin"
            >
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
    console.log(currentUser);
    return (
      <div className="container-fluid shadow p-2 mb-4">
        <nav class="navbar navbar-expand-lg navbar-light">
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
            <ul class="navbar-nav mr-auto">
              <li className="nav-item">
                <a
                  className="nav-link"
                  aria-current="/post/create"
                  href="/newpost"
                >
                  Create post
                </a>
              </li>
              {currentUser ? (
                <li className="nav-item">
                  <a
                    className="nav-link"
                    aria-current="page"
                    href={"/authors/nofun.herokuapp.com/" + currentUser.id.split("/")[4] + "/"}
                  >
                    My profile
                  </a>
                </li>
              ) : null}
              <li className="nav-item">
                <a
                  className="nav-link"
                  aria-current="page"
                  href="/inbox"
                >
                  Inbox
                </a>
              </li>
              {this.renderHeader()}
            </ul>
            <form class="d-flex ms-auto">
              <input
                class="form-control me-2"
                type="search"
                placeholder="search author"
                aria-label="Search"
                value={search}
                onChange={(e) => this.setState({ search: e.target.value })}
              ></input>
              <button
                class="btn btn-outline-success "
                type="submit"
                onClick={this.handleSearch}
              >
                Search
              </button>
            </form>
          </div>
        </nav>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  currentUser: state.user.currentUser,
  domains: state.domain.domains,
});

const mapDispatchToProps = (dispatch) => ({
  setCurrentUser: (user) => dispatch(setCurrentUser(user)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Header);
