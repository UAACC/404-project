import React from "react";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import AccountBoxIcon from "@material-ui/icons/AccountBox";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";
import axios from "axios";
import { connect } from "react-redux";
import { setCurrentUser } from "../redux/user/useractions";
import { Octokit } from "@octokit/core";


class ProfileCard extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      editOpen: false,
      id: props.user.id,
      github: props.user.github,
      password: props.user.password ?? "",
      email: props.user.email ?? "",
      host: props.user.host,
      url: props.user.url,
      displayName: props.user.displayName
    }
  }

  componentDidMount = () => {
    const { currentUser } = this.props;
    const { id } = this.state;
    if (currentUser?.id === id) {
      this.setState({
        email: currentUser?.email,
        password: currentUser?.password
      });
    }
  }

  handleUpdateProfile = async () => {
    const { domains, domain } = this.props;
    const { id, email, github, password, displayName } = this.state;
    let auth = null;

    domains.map(d => {
      if (d.domain === domain) {
        auth = d.auth;
      }
    })

    const config = {
      headers: {
        "Authorization": auth,
      },
    };
    
    const doc = await axios.put(id + "/", { email, displayName, github, password }, config);
    if (doc.data) {
      await this.props.setCurrentUser(doc.data);
      window.location = `/authors/${id.split("/")[2]}/${id.split("/")[4]}/`;
    }
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

  handleEditProfile = async () => {
    const { github } = this.state;
    if (github) {
      const res = await this.handleVerifyGithubAccount();
      if (res) this.handleUpdateProfile();
    } else {
      this.handleUpdateProfile();
    }
  }

  handleAddFriend = async () => {
    const {  id } = this.state;
    const { domain, currentUser, domains } = this.props;

    let auth = null;

    domains.map(d => {
      if (d.domain === domain) {
        auth = d.auth;
      }
    })

    const config = {
      headers: {
        Authorization: auth.split(" ")[1],
      },
    };

    const doc = await axios.post("https://" + domain + "/friendrequest/", {
      from_user: currentUser.id,
      to_user: id
    }, config);
    
    if (doc.data) {
      window.alert(doc.data);
    } else {
      window.alert("Fail!");
    }
  }

  // TODO: delete a friend
  handleDeleteFriend = async () => {
    const {  id } = this.state;
    const { currentUser, domains, domain } = this.props;
    let auth = null;

    domains.map(d => {
      if (d.domain === domain) {
        auth = d.auth;
      }
    })

    const config = {
      headers: {
        "Authorization": auth,
      },
    };

    const doc = await axios.patch("https://nofun.herokuapp.com/friendrequest/delete/", {from_user: currentUser.id, to_user: id}, config);
    if (doc.data) {
      window.alert(doc.data);
      window.location = "/" + domain + "/" + id.split("/")[4];
    }
  }

  

  render(){
    const { id, email, editOpen, displayName, password, url, github, host} = this.state;
    const { currentUser, userFriends } = this.props;
    return (
      <Paper style={{ overflow: "auto" }}>
        <Card style={{overflow: "scroll"}}>
          <CardContent width={1}>
            <Typography
              color="textSecondary"
              gutterBottom
            >
              <AccountBoxIcon fontSize="large"></AccountBoxIcon>
              <b>{displayName}</b>
            </Typography>
            {
              editOpen ?
              <div>
                <TextField label="DisplayName" value={displayName} onChange={(e) => this.setState({displayName: e.target.value})} />
                <TextField label="Github" value={github} onChange={(e) => this.setState({github: e.target.value})} />
                <TextField label="Email" value={email} onChange={(e) => this.setState({email: e.target.value})} />
                <TextField label="Password" value={password} onChange={(e) => this.setState({password: e.target.value})} />
              </div>
              :
              <div>
                <Typography variant="body1" component="h4">
                  DisplayName: {displayName}
                </Typography>
                <Typography variant="body1" component="h4">
                  Github: {github}
                </Typography>
                <Typography variant="body1" component="h4">
                  Host: {host}
                </Typography>
                <Typography variant="body1" component="h4">
                  URL: {url}
                </Typography>
              </div>
            }
          </CardContent>
          <CardActions>
            {
              editOpen ? 
              <Button
              variant="contained"
              color="primary"
              startIcon={<PersonAddIcon />}
              onClick={this.handleEditProfile}
              style={{ marginLeft: "10px", marginBottom: "10px" }}
            >
              Confirm
            </Button>
            :
              currentUser?.id === this.props.user.id ?
              <Button
                variant="contained"
                color="secondary"
                startIcon={<PersonAddIcon />}
                onClick={() => this.setState({editOpen: !this.state.editOpen})}
                style={{ marginLeft: "10px", marginBottom: "10px" }}
              >
                Edit
              </Button>
              :
              <div>
                {
                  userFriends?.includes(id) ? 
                  <Button color="secondary" variant="contained" style={{marginLeft: 15}} onClick={this.handleDeleteFriend}>Delete</Button>
                  :
                  <Button color="primary" variant="contained" onClick={this.handleAddFriend}>Add</Button>
                }
              </div>
            }
          </CardActions>
        </Card>
      </Paper>
    );
  }
}

const mapStateToProps = (state) => ({
  currentUser: state.user.currentUser,
  userFriends: state.user.userFriends,
  domains: state.domain.domains
});

const mapDispatchToProps = (dispatch) => ({
  setCurrentUser: (user) => dispatch(setCurrentUser(user)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ProfileCard);

