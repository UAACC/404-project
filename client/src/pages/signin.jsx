import React from "react";
import axios from "axios";
import "./style/signup.css";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import { TextField } from "@material-ui/core";
import Link from "@material-ui/core/Link";
import { connect } from "react-redux";
import { setCurrentUser, setUserFriends } from "../redux/user/useractions";
import CssBaseline from "@material-ui/core/CssBaseline";

class SignInPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      loginError: "",
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  handleSaveUser = async (data) => {
    await this.props.setCurrentUser(data);
  };

  handleSubmit = async (event) => {
    event.preventDefault();
    const { username, password } = this.state;
    const { domains } = this.props;

    let auth = null;
    domains.map((d) => {
      if (d.domain.includes("nofun")) {
        auth = d.auth;
      }
    });

    const config = {
      headers: {
        Authorization: auth,
      },
    };

    try {
      const doc = await axios.post(
        "https://nofun.herokuapp.com/author/login/",
        { username, password },
        config
      );

      if (doc.data === false) {
        window.alert("You have to wait for admin to approve your account!")
      } else if (typeof doc.data === "string") {
        window.alert("Wrong crendentials!");
      } else {
        await this.handleSaveUser(doc.data);
        window.location = "/";
      }
    } catch {
      window.alert("Wrong crendentials!");
    }
  };

  render() {
    return (
      <Grid container component="main">
        <CssBaseline />
        <Grid item xs={false} md={7}>
          <div className="image"></div>
        </Grid>
        <Grid item md={5}>
          <div className="login">
            <section className="logincontent">
              <h2>Log in</h2>
              <form className="form" onSubmit={this.handleSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      variant="outlined"
                      required
                      fullWidth
                      id="username"
                      label="User Name"
                      name="username"
                      value={this.state.username}
                      onChange={this.handleChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      variant="outlined"
                      required
                      fullWidth
                      style={{ marginTop: 5 }}
                      id="password"
                      label="Password"
                      name="password"
                      type="password"
                      value={this.state.password}
                      onChange={this.handleChange}
                    />
                  </Grid>
                </Grid>
                <Button
                  type="Log in"
                  fullWidth
                  variant="contained"
                  color="primary"
                  className="submit"
                  size="large"
                  style={{ marginTop: 20 }}
                  onClick={this.handleSignIn}
                >
                  Log in
                </Button>
                <Grid
                  container
                  alignItems="center"
                  justify="center"
                  spacing={0}
                  direction="column"
                  style={{ minHeight: "5vh", marginTop: 10 }}
                >
                  <Grid item xs>
                    <Link href="/signup" variant="body2">
                      {"Don't have an account? Sign Up"}
                    </Link>
                  </Grid>
                </Grid>
              </form>
            </section>
          </div>
        </Grid>
      </Grid>
    );
  }
}

const mapStateToProps = (state) => ({
  currentUser: state.user.currentUser,
  domains: state.domain.domains,
});

const mapDispatchToProps = (dispatch) => ({
  setCurrentUser: (user) => dispatch(setCurrentUser(user)),
  setUserFriends: (friends) => dispatch(setUserFriends(friends))
});

export default connect(mapStateToProps, mapDispatchToProps)(SignInPage);
