import React from "react";
import { connect } from "react-redux";
import "./style/common.css";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import ProfileComponent from "../components/ProfileComponent";
import PostsScroll from "../components/UserPostsScroll";
import axios from "axios";
import Header from "../components/Header";

class ProfilePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { id: null, user: null };
  }

  componentDidMount = async () => {
    const config = {
      headers: {
        'Authorization': "Basic UmVtb3RlMTpyZW1vdGUxMjM0",
        'Content-Type': 'application/json'
      }
    }

    const doc = await axios.get("https://" + this.props.match.params.domain + "/author/" + this.props.match.params.id, config);
    this.setState({ user: doc.data });
  };

  render() {
    const { user } = this.state;
    return (
      <div>
        <Header />
        <div
          style={{ marginLeft: "10%", marginRight: "10%", marginTop: "30px" }}
        >
          {user && (
            <Grid
              container
              spacing={3}
              direction="horizenol"
              justify="center"
              alignItems="flex-start"
            >
              <Grid item sm={3}>
                <Paper>
                  <ProfileComponent user={user} domain={this.props.match.params.domain}/>
                </Paper>
              </Grid>
              <Grid item sm={7}>
                <Paper style={{ height: "710px", overflow: "auto" }}>
                  <PostsScroll user={user} />
                </Paper>
              </Grid>
            </Grid>
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  currentUser: state.user.currentUser,
});

export default connect(mapStateToProps)(ProfilePage);
