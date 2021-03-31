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
    let doc = null;
    try {
      doc = await axios.get(
        "https://nofun.herokuapp.com/author/" + this.props.match.params.id + "/"
      );
    } catch {
      doc = await axios.get(
        "https://c404-w2021-t1-social-distribut.herokuapp.com/author/" +
          this.props.match.params.id +
          "/"
      );
    }
    this.setState({ user: doc.data });
    console.log("----", this.state.user);
  };
  render() {
    const { user } = this.state;
    return (
      <div>
        <Header />
        <div
          style={{ marginLeft: "10%", marginRight: "10%", marginTop: "30px" }}
        >
          {user ? (
            <Grid
              container
              spacing={3}
              direction="horizenol"
              justify="center"
              alignItems="flex-start"
            >
              <Grid item sm={3}>
                <Paper>
                  <ProfileComponent user={user} />
                </Paper>
              </Grid>
              <Grid item sm={7}>
                <Paper style={{ height: "710px", overflow: "auto" }}>
                  <PostsScroll user={user} />
                </Paper>
              </Grid>{" "}
            </Grid>
          ) : null}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  currentUser: state.user.currentUser,
});

export default connect(mapStateToProps)(ProfilePage);
