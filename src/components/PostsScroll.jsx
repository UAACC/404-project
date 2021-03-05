import React from "react";
// redux
import Posting from "./Posting.jsx";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Profile from "./ProfileComponent.jsx";
import Typography from "@material-ui/core/Typography";
import HourglassEmptyIcon from "@material-ui/icons/HourglassEmpty";
import axios from "axios";

class PostsScroll extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
    };
  }

  componentDidMount = async () => {
    const doc = await axios.get("/api/posts/");
    this.setState({ posts: doc.data });
  };

  render() {
    const { posts } = this.state;
    console.log(posts);
    return (
      <div>
        {posts.length !== 0 ? (
          posts.map((post) => (
            <Grid item>
              <Paper style={{ overflow: "auto" }}>
                <Posting
                  post={post}
                  handleClick={() => (window.location = "/posts/" + post.id)}
                ></Posting>
              </Paper>
            </Grid>
          ))
        ) : (
          <center>
            <HourglassEmptyIcon
              fontSize="large"
              style={{ marginTop: 20 }}
            ></HourglassEmptyIcon>
            <Typography variant="h3" style={{ marginLeft: 20 }}>
              processing ...
            </Typography>
          </center>
        )}
        <Grid item xs={3}></Grid>
      </div>
    );
  }
}

// const mapStateToProps = (state) => ({
//   currentUser: state.user.currentUser,
// });

// export default connect(mapStateToProps)(Header);
export default PostsScroll;
