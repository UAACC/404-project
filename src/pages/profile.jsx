import React from "react";
import { connect } from "react-redux";
import "./style/common.css";
import Header from "../components/Header";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import ProfileComponent from "../components/ProfileComponent";
import PostsScroll from "../components/PostsScroll";

class ProfilePage extends React.Component {
  render() {
    const { token } = this.props.currentUser;
    console.log(token);
    return (
      <div>
        <Header></Header>
        <div
          style={{ marginLeft: "10%", marginRight: "10%", marginTop: "30px" }}
        >
          <Grid
            container
            spacing={4}
            direction="horizenol"
            justify="center"
            alignItems="flex-start"
          >
            <Grid item xs={8}>
              <Paper style={{ height: "710px", overflow: "auto" }}>
                <PostsScroll></PostsScroll>
              </Paper>
            </Grid>
            <Grid item xs={4}>
              <Paper>
                <ProfileComponent></ProfileComponent>
              </Paper>
            </Grid>
          </Grid>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  currentUser: state.user.currentUser,
});
export default connect(mapStateToProps)(ProfilePage);
