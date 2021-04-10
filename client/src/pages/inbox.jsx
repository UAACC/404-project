import React from "react";
import "./style/common.css";
import {
  CardActions,
  CardContent,
  Card,
  Typography,
  Button,
  Grid,
} from "@material-ui/core";
import axios from "axios";
import PropTypes from "prop-types";
import Badge from "@material-ui/core/Badge";
import { connect } from "react-redux";
import Header from "../components/Header";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Box from "@material-ui/core/Box";
import Paper from "@material-ui/core/Paper";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}

class Inbox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      requests: [],
      value: "",
    };
  }

  componentDidMount = async () => {
    let auth = null;
    const { currentUser, domains } = this.props;
    const host_for_currentUser = currentUser.host.split("/")[2];
    domains.map((d) => {
      if (d.domain === host_for_currentUser) {
        auth = d.auth;
      }
    });
    const config = {
      headers: {
        "Authorization": auth
      },
    };

    await this.handleFriendRequest(config);
    await this.handlePostInbox(config);
    await this.handleCommentInbox(config);
    await this.handleLikeInbox(config);
  };

  handleFriendRequest = async (config) => {
    const { currentUser, domains } = this.props;
    // get the nofun token from redux
    // get the host matches the currentUser
    const doc = await axios.get(currentUser.id + "/inbox/request-list", config);
    console.log(doc);

    //put all request item in state
    const requests = doc.data?.items ?? [];
    let res;
    //literate through items and append displayname to each item
    if (requests.length !== 0) {
      const ApiRequests = requests.map(req => {
        if (req.from_user.includes("nofun")) {
          return axios.get(req.from_user, config);
        } else {
          // TODO: if the author is from team 17
        }
      });
      res = await Promise.all(ApiRequests);
      res.map((doc, index) => {
        const r = doc.data;
        const request_displayName = r.displayName;
        requests[index].name = request_displayName;
      })
      console.log(requests);
    }
    this.setState({ requests });
  }

  handlePostInbox = async (config) => {
    const { currentUser, domains } = this.props;
    const doc = await axios.get("https://nofun.herokuapp.com/author/" + currentUser?.id.split("/")[4] + "/inbox/", config);

    let posts = doc.data?.items.map(item => {
      const stuff = item.items.split(",");
      const type = stuff[0].split("'")[3];

      if (type === "post") {
        const title = stuff[1]?.split("'")[3];
        const contentType = stuff[5]?.split("'")[3];
        const content = stuff[6]?.split("'")[3];
        const authorId = stuff[7]?.split("'")[3];
        const postId = stuff[14]?.split("'")[3];
        return {
          type, title, contentType, content, authorId, postId
        };
      }
    });

    posts = posts.filter(p => !!p);
    
    let auth;
    const APIs = posts.map(post => {
      const domain = post.authorId.split("/")[2];
      domains.map((d) => {
        if (d.domain === domain) {
          auth = d.auth;
        }
      });
      const config = {
        headers: {
          "Authorization": auth
        },
      };
      return axios.get(post.authorId, config);
    });

    let res = await Promise.all(APIs);
    res = res.map(d => d.data);
    posts = posts.map((post, i) => {
      return {
        ...post,
        author: res[i]
      }
    })

    this.setState({ posts });
  }

  handleCommentInbox = async (config) => {
    const { currentUser, domains } = this.props;
    const doc = await axios.get("https://nofun.herokuapp.com/author/" + currentUser?.id.split("/")[4] + "/inbox/", config);

    let comments = doc.data?.items.map(item => {
      const stuff = item.items.split(",");
      const type = stuff[0].split("'")[3];

      if (type === "comment") {
        console.log(stuff)
        const authorId = stuff[1]?.split("'")[3];
        const postId = stuff[2]?.split("'")[3];
        const comment = stuff[3]?.split("'")[3];
        const commentId = stuff[5]?.split("'")[3];
        return {
          authorId, postId, commentId, comment
        };
      }
    });

    comments = comments.filter(p => !!p);
    
    let auth;
    const APIs = comments.map(comment => {
      const domain = comment.authorId.split("/")[2];
      domains.map((d) => {
        if (d.domain === domain) {
          auth = d.auth;
        }
      });
      const config = {
        headers: {
          "Authorization": auth
        },
      };
      return axios.get(comment.authorId, config);
    });

    let res = await Promise.all(APIs);
    res = res.map(d => d.data);
    comments = comments.map((comment, i) => {
      return {
        ...comment,
        author: res[i]
      }
    })
    console.log(comments);
    this.setState({ comments });
  }

  handleLikeInbox = async (config) => {
    const { currentUser, domains } = this.props;
    const doc = await axios.get("https://nofun.herokuapp.com/author/" + currentUser?.id.split("/")[4] + "/inbox/", config);

    let comments = doc.data?.items.map(item => {
      const stuff = item.items.split(",");
      const type = stuff[0].split("'")[3];

      if (type === "like") {
        console.log(stuff)
        // const authorId = stuff[1]?.split("'")[3];
        // const postId = stuff[2]?.split("'")[3];
        // const comment = stuff[3]?.split("'")[3];
        // const commentId = stuff[5]?.split("'")[3];
        // return {
        //   authorId, postId, commentId, comment
        // };
      }
    });

    comments = comments.filter(p => !!p);
    
    let auth;
    const APIs = comments.map(comment => {
      const domain = comment.authorId.split("/")[2];
      domains.map((d) => {
        if (d.domain === domain) {
          auth = d.auth;
        }
      });
      const config = {
        headers: {
          "Authorization": auth
        },
      };
      return axios.get(comment.authorId, config);
    });

    let res = await Promise.all(APIs);
    res = res.map(d => d.data);
    comments = comments.map((comment, i) => {
      return {
        ...comment,
        author: res[i]
      }
    })
    console.log(comments);
    this.setState({ comments });
  }

  //"from_user_domain" distinguish the domain name no matter what server this "from user" is from
  handleAccept = async (from_user, from_user_domain) => {
    let auth = null;
    const { currentUser } = this.props;
    const { domains } = this.props;

    // get the nofun token from redux
    // get the host matches the currentUser
    const host_for_currentUser = currentUser.host.split("/")[2];
    domains.map((d) => {
      if (d.domain === host_for_currentUser) {
        auth = d.auth;
      }
    });

    const config = {
      headers: {
        "Authorization": auth,
      },
    };
    console.log(from_user, currentUser.id);
    const doc = await axios.patch(
      "https://" + from_user_domain + "/friendrequest/accept/",
      {
        from_user,
        to_user: currentUser?.id,
      },
      config
    );

    if (doc) {
      this.componentDidMount();
      console.log(doc.data);
    }
  };

  handleDecline = async (from_user, from_user_domain) => {
    let auth = null;
    const { currentUser } = this.props;
    const { domains } = this.props;

    // get the nofun token from redux
    // get the host matches the currentUser
    const host_for_currentUser = currentUser.host.split("/")[2];
    domains.map((d) => {
      if (d.domain === host_for_currentUser) {
        auth = d.auth;
      }
    });

    const config = {
      headers: {
        "Authorization": auth,
      },
    };

    const doc = await axios.patch(
      "https://" + from_user_domain + "/friendrequest/decline/",
      {
        from_user,
        to_user: currentUser.id,
      },
      config
    );

    if (doc) {
      this.componentDidMount();
      console.log(doc.data);
    }
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };

  render() {
    const { requests, posts, likes, comments } = this.state;
    return (
      <div>
        <Header />
        <div
          style={{
            marginLeft: "20%",
            marginRight: "15%",
            marginTop: "15px",
            display: "flex",
          }}
        >
          <Tabs
            value={this.state.value}
            onChange={this.handleChange}
            aria-label="tabs"
            orientation="vertical"
            variant="scrollable"
            style={{
              paddingRight: "2%",
            }}
          >
            <Tab label="posts" {...a11yProps(0)} />
            <Tab label="comments" {...a11yProps(1)} />
            <Tab label="likes" {...a11yProps(2)} />
            {requests != null && requests.length < 1 ? (
              <Tab
                label={
                  <Badge badgeContent={requests.length} color="primary">
                    Friend Requsets
                  </Badge>
                }
                {...a11yProps(3)}
              />
            ) : (
              <Tab label="Friend Requsets" {...a11yProps(3)} />
            )}
          </Tabs>
          <TabPanel value={this.state.value} index={0}>
          <Grid
              container
              spacing={2}
              direction="horizenol"
              alignItems="flex-start"
            >
              <Grid item xs={12}>
                {posts?.length >= 1 ? (
                  posts.map((post) => (
                    <Card style={{ marginTop: "2%", width: "80%", marginLeft: "10%" }}>
                      <CardActions onClick={() => window.location = "/posts/" + post.postId.split("/")[2] + "/" + post.postId.split("/")[4] + "/" + post.postId.split("/")[6] + "/"}>
                        <p><b>{post.author.displayName}</b>{" "}created a post (click to check it)</p>
                        {post.contentType === "image" ? <img src={post.content} style={{width: "80%"}} /> : <p><b>Content</b>: {post.content}</p>}
                      </CardActions>
                    </Card>
                  ))
                ) : (
                  <h7>You have not had any post created by your friends yet!</h7>
                )}
              </Grid>
            </Grid>
          </TabPanel>
          <TabPanel value={this.state.value} index={1}>
          <Grid
              container
              spacing={2}
              direction="horizenol"
              alignItems="flex-start"
            >
              <Grid item xs={12}>
                {comments?.length >= 1 ? (
                  comments.map((comment) => (
                    <Card style={{ marginTop: "2%", width: "80%", marginLeft: "10%" }}>
                      <CardActions onClick={() => window.location = "/posts/" + comment.postId.split("/")[2] + "/" + comment.postId.split("/")[4] + "/" + comment.postId.split("/")[6] + "/"}>
                        <p><b>{comment.author.displayName}</b>{" "}created a comment on your post (click to check it)</p>
                        <p><b>Content</b>: {comment.comment}</p>
                      </CardActions>
                    </Card>
                  ))
                ) : (
                  <h7>You have not received any comment from other user!</h7>
                )}
              </Grid>
            </Grid>
          </TabPanel>
          <TabPanel value={this.state.value} index={2}>
            likes
          </TabPanel>
          <TabPanel value={this.state.value} index={3}>
            <Grid
              container
              spacing={2}
              direction="horizenol"
              alignItems="flex-start"
            >
              <Grid item xs={12}>
                {requests?.length >= 1 ? (
                  requests.map((doc) => (
                    <Card style={{ marginTop: "2%", width: "80%", marginLeft: "10%" }}>
                      <CardActions>
                        <h7> {doc.name} has sent you <b style={{color: "blue"}}>friend request</b> </h7>
                        <Button
                          color="primary"
                          variant="contianed"
                          style={{ marginLeft: "30%" }}
                          onClick={() => {
                            this.handleAccept(
                              doc.from_user,
                              doc.from_user.split("/")[2]
                            )
                          }}
                        >
                          Accept
                        </Button>
                        <Button
                          size="small"
                          color="primary"
                          variant="contianed"
                          onClick={() =>
                            this.handleDecline(
                              doc.from_user,
                              doc.from_user.split("/")[2]
                            )
                          }
                        >
                          Reject
                        </Button>
                      </CardActions>
                    </Card>
                  ))
                ) : (
                  <h7>You have not had any friend requests yet!</h7>
                )}
              </Grid>
            </Grid>
          </TabPanel>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  currentUser: state.user.currentUser,
  domains: state.domain.domains,
});

export default connect(mapStateToProps)(Inbox);
