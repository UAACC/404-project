import React from "react";
// redux
import Posting from "./Posting.jsx";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Profile from "./ProfileComponent.jsx";
import CommentCard from "./commentCard.jsx";
import Typography from "@material-ui/core/Typography";
import HourglassEmptyIcon from "@material-ui/icons/HourglassEmpty";
import axios from "axios";
import { connect } from "react-redux";

class PostsScroll extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
    };
  }

  componentDidMount = async () => {
    const doc = await axios.get("https://nofun.herokuapp.com/posts/");
    const posts = [];
    const { currentUser } = this.props;
    for (let post of doc.data) {
      if (post.author === currentUser.id) {
        posts.push(post);
      }
    }
    this.setState({ posts });
  };

  render() {
    const { posts } = this.state;
    const { user, currentUser } = this.props;
    return (
      <div className="row">
        {posts.length !== 0 ? (
          posts.map((post) => (
            <Grid item xm={12} sm={12}>
              <Paper style={{ overflow: "auto" }}>
                <Posting
                  post={post}
                  handleClick={() =>
                    (window.location = "/posts/" + post.id + "/")
                  }
                ></Posting>
              </Paper>
            </Grid>
          ))
        ) : (
          <center>
            <HourglassEmptyIcon
              fontSize="small"
              style={{ marginTop: 50 }}
            ></HourglassEmptyIcon>
            {user && currentUser && user.id === currentUser.id ? (
              <div>
                <Typography variant="h7" style={{ marginTop: 30 }}>
                  You have not posted any content yet, let's post!
                </Typography>
                <br />
                <Button
                  color="primary"
                  size="large"
                  variant="contained"
                  style={{ marginTop: 20 }}
                  onClick={() => (window.location = "/newpost/")}
                >
                  Post
                </Button>
              </div>
            ) : (
              <Typography variant="h7" style={{ marginLeft: 20 }}>
                This author has not posted any content yet!
              </Typography>
            )}
          </center>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  currentUser: state.user.currentUser,
});

export default connect(mapStateToProps)(PostsScroll);
