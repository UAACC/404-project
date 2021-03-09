import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import AccountBoxIcon from "@material-ui/icons/AccountBox";
import DeleteIcon from "@material-ui/icons/Delete";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import { sizing } from "@material-ui/system";
import Paper from "@material-ui/core/Paper";
import Cookies from "js-cookie"
import axios from "axios";
import { connect } from "react-redux";
import { setCurrentUser } from "../redux/user/useractions";


class ProfileCard extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      editOpen: false,
      id: props.user.id,
      token: props.user.token,
      username: props.user.username,
      email: props.user.email,
      github: props.user.github,
      bio: props.user.bio,
      password: props.user.password,
    }
  }

  handleEditProfile = async () => {
    const { token, id } = this.state;
    const { email, github, bio, password } = this.state;
    const csrftoken = Cookies.get('csrftoken');
    const config = {
      headers: {
        "Authorization": `Token ${token}`,
        'X-CSRFToken': csrftoken,
        "Content-type": "application/json",
      }
    }
    const doc = await axios.patch(`/api/authors/${id}/`, { email, github, bio, password }, config);

    if (doc.data) {
      // await this.props.setCurrentUser(doc.data);
      window.location = `/authors/${id}/`;
    }
  }


  render(){
    const { editOpen, username, email, password, bio, github} = this.state;
    const { currentUser } = this.props;
    return (
      <Paper style={{ overflow: "auto" }}>
        <Card >
          <CardContent width={1}>
            <Typography
              color="textSecondary"
              gutterBottom
            >
              <AccountBoxIcon fontSize="large"></AccountBoxIcon>
              <b>{username}</b>
            </Typography>
            {
              editOpen ?
              <div>
                <TextField label="Email" value={email} onChange={(e) => this.setState({email: e.target.value})} />
                <TextField label="Password" type="password" value={password} onChange={(e) => this.setState({password: e.target.value})} />
                <TextField label="Github" value={github} onChange={(e) => this.setState({github: e.target.value})} />
                <TextField label="Bio" value={bio} onChange={(e) => this.setState({bio: e.target.value})} />
              </div>:
              <div>
                <Typography variant="body1" component="h4">
                  Email: {email}
                </Typography>
                <Typography variant="body1" component="h4">
                  Github: {github}
                </Typography>
                <div className="row">
                  <Typography variant="body1" component="h4">
                    Bio:
                  </Typography>
                  <Typography
                    variant="body3"
                    component="p"
                    style={{ marginLeft: "50px" }}
                  >
                    {bio}
                    <br />
                  </Typography>
                </div>
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
              currentUser && currentUser.id === this.props.user.id ?
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
              null
            }
          </CardActions>
        </Card>
      </Paper>
    );
  }
}

const mapStateToProps = (state) => ({
  currentUser: state.user.currentUser,
});

const mapDispatchToProps = (dispatch) => ({
  setCurrentUser: (user) => dispatch(setCurrentUser(user)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ProfileCard);

