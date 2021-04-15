import React from "react";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";
import axios from "axios";
import { connect } from "react-redux";
import { setCurrentUser } from "../redux/user/useractions";
import { Octokit } from "@octokit/core";
import Avatar from "@material-ui/core/Avatar";
import FaceIcon from "@material-ui/icons/Face";
import GitHubIcon from "@material-ui/icons/GitHub";
import BlurLinearIcon from "@material-ui/icons/BlurLinear";
import HomeWorkIcon from "@material-ui/icons/HomeWork";

class ProfileCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editOpen: false,
      id: props.user.id,
      github: props.user.github,
      password: props.user.password ?? "",
      email: props.user.email ?? "",
      host: props.user.host,
      url: props.user.url,
      displayName: props.user.displayName,
    };
  }

  componentDidMount = () => {
    const { currentUser } = this.props;
    const { id } = this.state;
    if (currentUser?.id === id) {
      this.setState({
        email: currentUser?.email,
        password: currentUser?.password,
      });
    }
  };

  handleUpdateProfile = async () => {
    const { domains, domain } = this.props;
    const { id, email, github, password, displayName } = this.state;
    let auth = null;

    domains.map((d) => {
      if (d.domain === domain) {
        auth = d.auth;
      }
    });

    const config = {
      headers: {
        Authorization: auth,
      },
    };

    const doc = await axios.post(
      id + "/",
      { email, displayName, github, password },
      config
    );
    if (doc.data) {
      console.log(doc.data);
      await this.props.setCurrentUser(doc.data);
      window.location = `/authors/${id.split("/")[2]}/${id.split("/")[4]}/`;
    }
  };

  handleVerifyGithubAccount = async () => {
    const octokit = new Octokit();
    if (this.state.github.split("/")[3]) {
      try {
        const doc = await octokit.request(
          "GET /users/" + this.state.github.split("/")[3]
        );
        console.log("Github", doc.data);
        if (doc.data) {
          window.alert("Verified Github account successfully!");
          return true;
        } else {
          window.alert("Sorry, this account does not exist");
          this.setState({ github: "" });
          return false;
        }
      } catch {
        window.alert("Sorry, this account does not exist");
        this.setState({ github: "" });
        return false;
      }
    } else {
      window.alert("Sorry, this account does not exist");
      this.setState({ github: "" });
      return false;
    }
  };

  handleEditProfile = async () => {
    const { github } = this.state;
    if (github) {
      const res = await this.handleVerifyGithubAccount();
      if (res) this.handleUpdateProfile();
    } else {
      this.handleUpdateProfile();
    }
  };

  handleAddFriend = async () => {
    const { id } = this.state;
    const { domain, currentUser, domains } = this.props;

    let auth = null;

    domains.map((d) => {
      if (d.domain === domain) {
        auth = d.auth;
      }
    });

    const config = {
      headers: {
        Authorization: auth,
      },
    };

    let doc;
    if (domain === "social-distribution-t1.herokuapp.com") {
      const id_digits = id.split("/")[4];
      doc = await axios.post(
        "https://social-distribution-t1.herokuapp.com/author/" +
          id_digits +
          "/inbox/",
        {
          type: "follow",
          actor: currentUser,
          object: id,
          summary: "friend request from team 20",
        },
        config
      );
      await axios.post("https://nofun.herokuapp.com/friendrequest/", {
        actor: currentUser.id,
        object: id,
      });
      await axios.put(
        "https://social-distribution-t1.herokuapp.com/author/" +
          id_digits +
          "/followers/" +
          currentUser?.id.split("/")[4] +
          "/",
        { remote: true },
        config
      );
    } else {
      doc = await axios.post(
        "https://" + domain + "/friendrequest/",
        {
          actor: currentUser.id,
          object: id,
        },
        config
      );
    }

    if (doc.data) {
      window.alert(doc.data);
    } else {
      window.alert("Fail!");
    }
  };

  handleDeleteFriend = async () => {
    const { id } = this.state;
    const { currentUser, domains, domain } = this.props;
    let auth = null;

    domains.map((d) => {
      if (d.domain === domain) {
        auth = d.auth;
      }
    });

    if (id.includes("t1")) {
      console.log(auth);
      const t1_url =
        "https://social-distribution-t1.herokuapp.com/author/" +
        id.split("/")[4] +
        "/friends/" +
        currentUser?.id.split("/")[4] +
        "/";
      await axios.delete(t1_url, {
        headers: {
          Authorization: auth,
        },
        data: {
          remote: true,
        },
      });
    }

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

    const doc = await axios.patch(
      "https://nofun.herokuapp.com/friendrequest/delete/",
      { actor: currentUser?.id, object: id },
      config
    );

    if (doc.data) {
      window.alert(doc.data);
      window.location = "/authors/" + domain + "/" + id.split("/")[4];
    }
  };

  render() {
    const {
      id,
      email,
      editOpen,
      displayName,
      password,
      url,
      github,
      host,
    } = this.state;
    const { currentUser, userFriends } = this.props;
    return (
      <Paper style={{ overflow: "auto" }}>
        <Card style={{ overflow: "scroll" }}>
          <CardContent>
            <Typography
              color="textSecondary"
              style={{ marginLeft: "40%", marginBottom: "5%" }}
            >
              <Avatar style={{ backgroundColor: "grey" }}></Avatar>
              <b style={{ marginLeft: "4px" }}>{displayName}</b>
            </Typography>
            {editOpen ? (
              <div>
                <TextField
                  label="DisplayName"
                  style={{ width: "90%" }}
                  value={displayName}
                  onChange={(e) =>
                    this.setState({ displayName: e.target.value })
                  }
                />
                <TextField
                  style={{ width: "90%" }}
                  label="Github"
                  value={github}
                  onChange={(e) => this.setState({ github: e.target.value })}
                />
                <TextField
                  label="Email"
                  style={{ width: "90%" }}
                  value={email}
                  onChange={(e) => this.setState({ email: e.target.value })}
                />
                <TextField
                  label="Password"
                  style={{ width: "90%" }}
                  value={password}
                  onChange={(e) => this.setState({ password: e.target.value })}
                />
              </div>
            ) : (
              <div>
                <div style={{ display: "flex", marginTop: "5px" }}>
                  <FaceIcon></FaceIcon>
                  <Typography variant="body1" style={{ marginLeft: "10px" }}>
                    {displayName}
                  </Typography>
                </div>
                <div style={{ display: "flex", marginTop: "5px" }}>
                  <GitHubIcon></GitHubIcon>
                  <Typography variant="body1" style={{ marginLeft: "10px" }}>
                    {github}
                  </Typography>
                </div>

                <div style={{ display: "flex", marginTop: "5px" }}>
                  <HomeWorkIcon></HomeWorkIcon>
                  <Typography
                    variant="body1"
                    display="inline"
                    style={{ marginLeft: "10px" }}
                  >
                    {host}
                  </Typography>
                </div>

                <div style={{ display: "flex", marginTop: "5px" }}>
                  <BlurLinearIcon></BlurLinearIcon>
                  <Typography
                    variant="body1"
                    style={{
                      marginLeft: "10px",
                    }}
                    component="p"
                  >
                    {url}
                  </Typography>
                </div>
              </div>
            )}
          </CardContent>
          <CardActions>
            {editOpen ? (
              <Button
                variant="contained"
                color="primary"
                startIcon={<PersonAddIcon />}
                onClick={this.handleEditProfile}
                style={{
                  marginLeft: "10px",
                  marginBottom: "10px",
                }}
              >
                Confirm
              </Button>
            ) : currentUser?.id === this.props.user.id ? (
              <Button
                variant="contained"
                color="secondary"
                startIcon={<PersonAddIcon />}
                onClick={() =>
                  this.setState({ editOpen: !this.state.editOpen })
                }
                style={{ marginLeft: "33%", marginBottom: "5%" }}
              >
                Edit
              </Button>
            ) : (
              <div>
                {userFriends?.includes(id) ? (
                  <Button
                    color="secondary"
                    variant="contained"
                    style={{ marginLeft: 15 }}
                    onClick={this.handleDeleteFriend}
                  >
                    Delete
                  </Button>
                ) : (
                  <Button
                    color="primary"
                    variant="contained"
                    onClick={this.handleAddFriend}
                    style={{ marginLeft: "5%", marginBottom: "5%" }}
                  >
                    Add
                  </Button>
                )}
              </div>
            )}
          </CardActions>
        </Card>
      </Paper>
    );
  }
}

const mapStateToProps = (state) => ({
  currentUser: state.user.currentUser,
  userFriends: state.user.userFriends,
  domains: state.domain.domains,
});

const mapDispatchToProps = (dispatch) => ({
  setCurrentUser: (user) => dispatch(setCurrentUser(user)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ProfileCard);
