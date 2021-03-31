import React from "react";
// redux
import { connect } from "react-redux";
import Header from "../components/Header";
import "./style/common.css";
import PostsScroll from "../components/PostsScroll";
import { Grid, List, Paper } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";

class MainPage extends React.Component {
  /*componentDidMount = () => {
    // extract user
    const user = this.props.currentUser;
  };*/
  render() {
    return (
      <div>
        <Header />
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
            <Grid item xs={10} sm={7}>
              <PostsScroll />
            </Grid>
            <Grid item xs={10} sm={3}>
              <Card>
                <CardContent width={1}>
                  <Typography color="textSecondary">
                    Suppose the friend list is displayed here
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
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
