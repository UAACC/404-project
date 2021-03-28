import React from "react";
// redux
import Posting from "./Posting.jsx";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Profile from "./ProfileComponent.jsx";
import CommentCard from "./commentCard.jsx";
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
    const allPosts = doc.data;
    const publicPosts = allPosts.filter(post => post.visibility === "public");
    this.setState({ posts: publicPosts });
  };

  render() {
    const { posts } = this.state;
    console.log(posts);
    return (
      <div className="row">
        {posts.length !== 0 ? (
          posts.map((post) => (
            <Grid item xm={12} sm={6}>
              <Paper style={{ overflow: "auto", marginTop: "2%" }}>
                <Posting
                  post={post}
                  handleClick={() => (window.location = "/posts/" + post.id + "/")}
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

      </div>

    );
  }
}

export default PostsScroll;
