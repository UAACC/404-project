import React from "react";
// redux
import Posting from "./Posting.jsx";
import { Paper, Button } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
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
      postPage: 1
    };
  }

  componentDidMount = async () => {
    let posts = [];

    const requests = this.props.domains?.map((domain) => {
      const config = {
        headers: {
          Authorization: domain.auth,
        },
      };
      return axios.get("https://" + domain.domain + "/post-list/", config);
    });

    const resArray = await Promise.all(requests);

    resArray.map((doc) => {
      posts = posts.concat(doc.data);
    });
    const publicPosts = posts.filter((post) => post.visibility === "PUBLIC");

    this.setState({ posts: publicPosts });
  };

  renderPages = () => {
    const { posts, postPage } = this.state;
    let pages = 1;

    pages = Number(posts.length / 5);
    const array = [];
    for (let i = 0; i <= pages; i++) {
      array.push(i);
    }
    return (
      <div style={{ marginLeft: "10%", marginRight: "10%" }}>
        {array.map((page, i) => (
          <Button
            style={{ height: "30px" }}
            color={i + 1 === postPage ? "primary" : "default"}
            variant="contained"
            onClick={() => this.setState({ postPage: i + 1 })}
          >
            {i + 1}
          </Button>
        ))}
      </div>
    );
  };

  handleLocal = () => {
    const { local } = this.state;
    this.setState({ local: !local }, () => this.componentDidMount());
  };

  render() {
    let { posts, postPage } = this.state;
    const { currCategory } = this.props;
    posts = posts.slice((postPage - 1) * 5, postPage * 5);

    return (
      <div>
        <div style={{margin: "10px", height: window.innerHeight * 0.8, overflow: "hidden", overflowY: "scroll"}}>
        {posts.length !== 0 ? (
          posts.map((post) => {
            if (currCategory) {
              let returned = false;
              if (Array.isArray(post.categories)) {
                if (post.categories.includes(currCategory)) {
                  returned = true;
                }
              } else {
                if (post.categories && JSON.parse(post.categories).includes(currCategory)) {
                  returned = true;
                }
              }
              if (returned) {
                  return (
                    <Grid item xm={12}>
                      <Paper style={{ overflow: "auto", marginTop: "2%" }}>
                        <Posting
                          post={post}
                          handleClick={() =>
                            (window.location =
                              "/posts/" +
                              post.id.split("/")[2] +
                              "/" +
                              post.id.split("/")[4] +
                              "/" +
                              post.id.split("/")[6] +
                              "/")
                          }
                        ></Posting>
                      </Paper>
                    </Grid>
                  );
              }
            } else {
              return (
                <Grid item xm={12}>
                  <Paper style={{ overflow: "auto", marginTop: "2%" }}>
                    <Posting
                      post={post}
                      handleClick={() =>
                        (window.location =
                          "/posts/" +
                          post.id.split("/")[2] +
                          "/" +
                          post.id.split("/")[4] +
                          "/" +
                          post.id.split("/")[6] +
                          "/")
                      }
                    ></Posting>
                  </Paper>
                </Grid>
              );
            }
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
        <hr />
        {this.renderPages()}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  domains: state.domain.domains,
});

export default connect(mapStateToProps)(PostsScroll);
