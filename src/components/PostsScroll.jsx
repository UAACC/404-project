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
    let posts = [];
    // const requests = this.props.domains?.map(domain => {
    //   if (domain === "https://c404-w2021-t1-social-distribut.herokuapp.com/") {
    //     return axios.get(domain + '/post-list/')
    //   } else {
    //     return axios.get(domain + '/posts/')
    //   }
    // });
    const doc1 = await axios.get("https://c404-w2021-t1-social-distribut.herokuapp.com/post-list/");
    const doc2 = await axios.get("https://nofun.herokuapp.com/posts/");
    posts = posts.concat(doc1.data);
    posts = posts.concat(doc2.data);
    console.log(posts);
    // const resArray = await Promise.all(requests);
    // console.log(resArray);
    // resArray.map(doc => {
    //   posts = posts.concat(doc.data);
    // })
    const publicPosts = posts.filter(post => post.visibility === "public" || post.visibility === "PUBLIC");
    console.log("type is ",typeof(posts[6].id) === "string");
    this.setState({ posts: publicPosts });
    
  };

  render() {
    const { posts } = this.state;

    return (
      <div className="row">
        {posts.length !== 0 ? (
          posts.map((post) => {
            if(typeof(post.id) === "string"){
              const postId = post.id.split("/")[4];
              return <Grid item xm={12} sm={6}>
                <Paper style={{ overflow: "auto", marginTop: "2%" }}>
                  <Posting
                    post={post}
                    //handleClick={() => (window.location = "/posts/" + postId + "/")}
                    handleClick={() => (window.location = post.id)}
                  ></Posting>
                </Paper>
              </Grid>
            }
            else{
              return <Grid item xm={12} sm={6}>
                <Paper style={{ overflow: "auto", marginTop: "2%" }}>
                  <Posting
                    post={post}
                    handleClick={() => (window.location = "/posts/" + post.id + "/")}
                  ></Posting>
                </Paper>
              </Grid>
            }
            
          })
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
