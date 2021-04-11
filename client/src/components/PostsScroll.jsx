import React from "react";
// redux
import Posting from "./Posting.jsx";
import Paper from "@material-ui/core/Paper";
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
      local: true
    };
  }

  componentDidMount = async () => {
    let posts = [];
  
    const requests = this.props.domains?.map(domain => {
      const config = {
        headers: {
          'Authorization': domain.auth,
        }
      }
      return axios.get("https://" + domain.domain + "/post-list/", config);
    });

    const resArray = await Promise.all(requests);

    resArray.map((doc) => {
      posts = posts.concat(doc.data);
    });
    const publicPosts = posts.filter((post) => post.visibility === "PUBLIC");

    this.setState({ posts: publicPosts });
  };

  handleLocal = () => {
    const { local } = this.state;
    this.setState({ local: !local }, () => this.componentDidMount());
  };

  render() {
    const { posts } = this.state;
    const { currCategory } = this.props;
    return (
      <div className="row">
        {posts.length !== 0 ? (
          posts.map((post) => {
            if (currCategory) {
              if (post.id.includes("nofun") && JSON.parse(post.categories).includes(currCategory)) {
                return (
                  <Grid item xm={12} sm={6}>
                    <Paper style={{ overflow: "auto", marginTop: "2%" }}>
                      <Posting
                        post={post}
                        handleClick={() =>
                          (window.location = "/posts/" + post.id.split("/")[2]+ "/" + post.id.split("/")[4]+ "/" +  post.id.split("/")[6] + "/")
                        }
                      ></Posting>
                    </Paper>
                  </Grid>
                );
              } else {
                return null;
              }
            } else {
              return <Grid item xm={12} sm={6}>
                <Paper style={{ overflow: "auto", marginTop: "2%" }}>
                  <Posting
                    post={post}
                    handleClick={() =>
                      (window.location = "/posts/" + post.id.split("/")[2]+ "/" + post.id.split("/")[4]+ "/" +  post.id.split("/")[6] + "/")
                    }
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
