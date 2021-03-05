import React from "react";
// redux
import { connect } from "react-redux";
import "./style/common.css";
import Header from "../components/Header";
import PostsScroll from "../components/PostsScroll";
import { Grid } from "@material-ui/core";

class MainPage extends React.Component {
  /*componentDidMount = () => {
    // extract user
    const user = this.props.currentUser;
  };*/
  render() {
    return (
      <div>
        <Header></Header>
        <div
          style={{ marginLeft: "10%", marginRight: "10%", marginTop: "30px" }}
        >
          <Grid item xs={9}>
            <PostsScroll></PostsScroll>
          </Grid>
        </div>
      </div>
    );
  }
}

export default MainPage;
/*
// redux
const mapStateToProps = (state) => ({
  currentUser: state.user.currentUser,
});
export default connect(mapStateToProps)(MainPage);
*/
