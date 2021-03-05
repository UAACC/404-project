import React from "react";
import axios from "axios";
import "./style/signin.css";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import { TextField } from "@material-ui/core";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Link from "@material-ui/core/Link";
import { connect } from "react-redux";
import { setCurrentUser } from "../redux/user/useractions";
import Cookies from 'js-cookie'

class SignUpPage extends React.Component {
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
  handleSubmit = async (event) => {
    event.preventDefault();
    const { username, password } = this.state;
    const csrftoken = Cookies.get('csrftoken');
    const config = {
      headers: {
        'X-CSRFToken': csrftoken,
        'Content-Type': 'application/json'
      }
    }
    const doc = await axios.post("/api/authors/", { username, password }, config);
    if (!doc.data) {
      window.alert("Wrong crendentials");
    } else {
      await this.props.setCurrentUser(doc.data);
      window.location = "/";
    }
  };

  render() {
    return (
      <div className="login">
        <section className="content">
          <h2>Create account</h2>
          <form className="form" onSubmit={this.handleSubmit}>
            <Grid container spacing={1}>
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
                  style={{ marginTop: 1 }}
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
            >
              Sign Up
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
                <Link href="/signin" variant="body2">
                  {"Already have an account? Sign In"}
                </Link>
              </Grid>
            </Grid>
          </form>
        </section>
      </div>
    );
  }
}


const mapDispatchToProps = (dispatch) => ({
  setCurrentUser: (user) => dispatch(setCurrentUser(user)),
});

export default connect(null, mapDispatchToProps)(SignUpPage);


