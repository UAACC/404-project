import React from "react";
import Posting from "./Posting.jsx";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
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
    const { user, domains, currentUser, userFriends } = this.props;

    let auth = null;
    domains.map(d => {
      if (d.domain === user.id.split("/")[2]) {
        auth = d.auth
      }
    });

    const config = {
      headers: {
        'Authorization': auth,
      }
    }

    const doc = await axios.get(user.id + "/posts/", config);
    const posts = doc.data;
    
    const publicPosts = posts.filter((post) => {
      return (
        (post?.visibility === "PUBLIC") ||
        (post?.author_id === currentUser?.id || post?.author === currentUser?.id ) ||
        (post?.visibility === "FRIENDS" && userFriends?.includes(user.id)) ||
        (post?.visibility !== "FRIENDS" && post?.visibility !== "UNLISTED" && JSON.parse(post?.visibility).includes(currentUser?.displayName))
      )
    });

    this.setState({ posts: publicPosts });
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
                    (window.location = "/posts/" + post.id.split("/")[2]+ "/" + post.id.split("/")[4]+ "/" +  post.id.split("/")[6] + "/")
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
            {user?.id === currentUser?.id && posts.length === 0 ? (
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
  domains: state.domain.domains,
  userFriends: state.user.userFriends,
  currentUser: state.user.currentUser
});

export default connect(mapStateToProps)(PostsScroll);
