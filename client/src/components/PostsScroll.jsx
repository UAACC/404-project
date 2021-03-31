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
import { connect } from "react-redux";

class PostsScroll extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      local: true,
    };
  }

  componentDidMount = async () => {
    let posts = [];
    const requests = this.props.domains?.map((domain) => {
      return axios.get("https://" + domain + "/post-list/");
    });

    const resArray = await Promise.all(requests);
    console.log(resArray);
    resArray.map((doc) => {
      posts = posts.concat(doc.data);
    });
    const publicPosts = posts.filter((post) => post.visibility === "PUBLIC");

    this.setState({ posts: publicPosts });
    console.log("---in posting", posts[3].content);
  };

  handleLocal = () => {
    const { local } = this.state;
    this.setState({ local: !local }, () => this.componentDidMount());
  };

  render() {
    const { posts } = this.state;

    return (
      <div className="row">
        {posts.length !== 0 ? (
          posts.map((post) => {
            const linksplit = post.id.split("/");
            //const linkOffset = "author/" + linksplit[4] + "/posts/" + linksplit[6];
            return (
              <Grid item xm={12} sm={6}>
                <Paper style={{ overflow: "auto", marginTop: "2%" }}>
                  <Posting
                    post={post}
                    handleClick={() =>
                      (window.location =
                        "/remotepostdetail/" + linksplit[6] + "/")
                    }
                  ></Posting>
                </Paper>
              </Grid>
            );
          })
        ) : (
          <center>
            <HourglassEmptyIcon
              fontSize="large"
              style={{ marginTop: 20 }}
            ></HourglassEmptyIcon>
            <Typography variant="h5" style={{ marginLeft: 20 }}>
              processing ...
            </Typography>
          </center>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  domains: state.domain.domains,
});

export default connect(mapStateToProps)(PostsScroll);
