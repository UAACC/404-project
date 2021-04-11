import React from "react";
import axios from "axios";
import "./style/signup.css";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import { TextField } from "@material-ui/core";
import { connect } from "react-redux";
import Link from "@material-ui/core/Link";
import { setCurrentUser } from "../redux/user/useractions";
import CssBaseline from "@material-ui/core/CssBaseline";
import { Octokit } from "@octokit/core";


class SignUpPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      displayName: "",
      username: "",
      password: "",
      email: "",
      github: "",
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

  handleVerifyGithubAccount = async () => {
    const octokit = new Octokit({ auth: `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` });
    if (this.state.github.split("/")[3]) {
      try {
        const doc = await octokit.request('GET /users/' + this.state.github.split("/")[3]);
        console.log("Github", doc.data);
        if (doc.data) {
          window.alert("Verified Github account successfully!");
          return true;
        } else {
          window.alert("Sorry, this account does not exist");
          this.setState({github: ""});
          return false;
        }
      } catch {
        window.alert("Sorry, this account does not exist");
        this.setState({github: ""});
        return false;
      }
    } else {
      window.alert("Sorry, this account does not exist");
        this.setState({github: ""});
        return false;
    }
  }

  handleSubmit = async (event) => {
    event.preventDefault();
    const { github } = this.state;
    console.log(github);
    if (!github) {
      this.handleSignUp();
    } else {
      const res = await this.handleVerifyGithubAccount();
      if (res){
        this.handleSignUp();
      }
    }
  }

  handleSignUp = async () => {
    const { username, password, displayName, email, github } = this.state;
    const { domains } = this.props;

    let auth = null;
    domains.map((d) => {
      if (d.domain.includes("nofun")) {
        auth = d.auth;
      }
    });

    console.log(auth);

    const config = {
      headers: {
        Authorization: auth,
      },
    };

    const doc = await axios.post(
      "https://nofun.herokuapp.com/author/",
      { username, password, displayName, email, github },
      config
    );
    await this.props.setCurrentUser(doc.data);
    window.alert(
      "Your request has been sent to admin, you can login after the approval by admin"
    );
    window.location = "/signin";
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
            <section className="content">
              <h2>Create account</h2>
              <form className="form" onSubmit={this.handleSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      variant="outlined"
                      required
                      fullWidth
                      id="displayName"
                      label="Display Name"
                      name="displayName"
                      value={this.state.displayName}
                      onChange={this.handleChange}
                    />
                  </Grid>
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
                      style={{ marginTop: 2 }}
                      id="password"
                      label="Password"
                      name="password"
                      type="password"
                      value={this.state.password}
                      onChange={this.handleChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      variant="outlined"
                      fullWidth
                      id="email"
                      label="Email"
                      name="email"
                      value={this.state.email}
                      onChange={this.handleChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      variant="outlined"
                      fullWidth
                      id="github"
                      label="Github"
                      name="github"
                      value={this.state.github}
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
                  style={{ marginTop: 30 }}
                >
                  Sign Up
                </Button>
                <Grid
                  container
                  alignItems="center"
                  justify="center"
                  spacing={0}
                  direction="column"
                  style={{ minHeight: "5vh", marginTop: 45 }}
                >
                  <Grid item xs>
                    <Link href="/signin" variant="body2">
                      {"Already have an account? Sign In"}
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
});

export default connect(mapStateToProps, mapDispatchToProps)(SignUpPage);
