import React from "react";
import "./style/common.css";
import {
  CardActions,
  CardContent,
  Card,
  Typography,
  Button,
  Grid,
  Avatar,
} from "@material-ui/core";
import axios from "axios";
import Badge from "@material-ui/core/Badge";
import { connect } from "react-redux";
import Header from "../components/Header";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Box from "@material-ui/core/Box";
import Paper from "@material-ui/core/Paper";
import { Octokit } from "@octokit/core";
import Pagination from "@material-ui/lab/Pagination";
import { TabPanel } from "../assets/Tab";

class Inbox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      requests: [],
      posts: [],
      likes: [],
      githubAcivities: [],
      comments: [],
      value: 0,
      postPage: 1,
      commentPage: 1,
      likePage: 1,
      githubPage: 1,
      requestpage: 1,
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
        Authorization: auth,
      },
    };

    await this.handleFriendRequest(config);
    await this.handlePostInbox(config);
    await this.handleCommentInbox(config);
    await this.handleGithubActivities(currentUser?.github);
    await this.handleLikeInbox(config);
  };

  handleGithubActivities = async (github) => {
    const octokit = new Octokit();
    let doc = null;
    if (github) {
      doc = await octokit.request(
        "GET /users/" + github.split("/")[3] + "/events"
      );
    }
    
    this.setState({ githubAcivities: doc?.data ?? [] });
  };

  handleFriendRequest = async (config) => {
    const { currentUser, domains } = this.props;
    // get the nofun token from redux
    // get the host matches the currentUser
    const doc = await axios.get(
      currentUser.id + "/inbox/request-list/",
      config
    );

    //put all request item in state
    const requests = doc.data?.items ?? [];
    let res = [];

    //literate through items and append displayname to each item
    if (requests.length !== 0) {
      const ApiRequests = requests.map((req) => {
        let auth = null;
        domains.map((d) => {
          if (d.domain === req.actor.split("/")[2]) {
            auth = d.auth;
          }
        });
        config = {
          headers: {
            Authorization: auth,
          },
        };
        return axios.get(req.actor, config);
      });
      res = await Promise.all(ApiRequests);
      res.map((doc, index) => {
        const r = doc.data;
        const request_displayName = r.displayName;
        requests[index].name = request_displayName;
      });
    }
    this.setState({ requests });
  };

  handlePostInbox = async (config) => {
    const { currentUser, domains } = this.props;
    const doc = await axios.get(
      "https://nofun.herokuapp.com/author/" +
        currentUser?.id.split("/")[4] +
        "/inbox/",
      config
    );

    let posts = doc.data?.items.map((item) => {
      if (item.status) {
        return null;
      }
      const type = item.type;

      if (type === "post") {
        const authorId = item.items.actor;
        const postId = item.items.object;
        const { title, contentType, content } = item.items;
        if (!authorId || !postId || !contentType) return null;
        return {
          type,
          title,
          contentType,
          content,
          authorId,
          postId,
        };
      }
    });
    posts = posts.filter((p) => !!p);

    let auth;
    const APIs = posts.map((post) => {
      const domain = post.authorId.split("/")[2];
      domains.map((d) => {
        if (d.domain === domain) {
          auth = d.auth;
        }
      });
      const config = {
        headers: {
          Authorization: auth,
        },
      };
      return axios.get(post.authorId, config);
    });

    let res = await Promise.all(APIs);
    res = res.map((d) => d.data);
    posts = posts.map((post, i) => {
      return {
        ...post,
        author: res[i],
      };
    });

    this.setState({ posts });
  };

  handleCommentInbox = async (config) => {
    const { currentUser, domains } = this.props;
    const doc = await axios.get(
      "https://nofun.herokuapp.com/author/" +
        currentUser?.id.split("/")[4] +
        "/inbox/",
      config
    );

    let comments = doc.data?.items.map((item) => {
      if (item.status) {
        return null;
      }
      const type = item.type;

      if (type === "comment") {
        console.log(item);
        const authorId = item.items.actor;
        const postId = item.items.object;
        const comment = item.items.comment;
        const commentId = item.items.id;
        if (!authorId || !postId || !comment) return null;
        return {
          authorId,
          postId,
          commentId,
          comment,
        };
      }
    });

    comments = comments.filter((p) => !!p);

    let auth;
    const APIs = comments.map((comment) => {
      const domain = comment.authorId.split("/")[2];
      domains.map((d) => {
        if (d.domain === domain) {
          auth = d.auth;
        }
      });
      const config = {
        headers: {
          Authorization: auth,
        },
      };
      return axios.get(comment.authorId, config);
    });

    let res = await Promise.all(APIs);
    res = res.map((d) => d.data);
    comments = comments.map((comment, i) => {
      return {
        ...comment,
        author: res[i],
      };
    });

    this.setState({ comments });
  };

  handleLikeInbox = async (config) => {
    const { currentUser, domains } = this.props;
    const doc = await axios.get(
      "https://nofun.herokuapp.com/author/" +
        currentUser?.id.split("/")[4] +
        "/inbox/",
      config
    );

    let likes = doc.data?.items.map((item) => {
      if (item.status) {
        return null;
      }
      const type = item.type;

      if (type === "Like") {
        const authorId = item.items.actor;
        const objectId = item.items.object;
        const comment = !!item.items.comment;
        if (!authorId || !objectId) return null;
        return {
          authorId,
          objectId,
          comment,
        };
      }
    });

    likes = likes.filter((p) => !!p);

    let auth;
    const APIs1 = likes.map((comment) => {
      const domain = comment.authorId.split("/")[2];
      domains.map((d) => {
        if (d.domain === domain) {
          auth = d.auth;
        }
      });
      const config = {
        headers: {
          Authorization: auth,
        },
      };
      return axios.get(comment.authorId, config);
    });

    let res1 = await Promise.all(APIs1);
    res1 = res1.map((d) => d.data);
    likes = likes.map((comment, i) => {
      return {
        ...comment,
        author: res1[i],
      };
    });

    const APIs2 = likes.map((comment) => {
      const domain = comment.objectId.split("/")[2];
      domains.map((d) => {
        if (d.domain === domain) {
          auth = d.auth;
        }
      });
      const config = {
        headers: {
          Authorization: auth,
        },
      };
      return axios.get(comment.objectId, config);
    });

    let res2 = await Promise.all(APIs2);
    res2 = res2.map((d) => d.data);
    likes = likes.map((comment, i) => {
      return {
        ...comment,
        object: res2[i],
      };
    });

    this.setState({ likes });
  };

  //"from_user_domain" distinguish the domain name no matter what server this "from user" is from
  handleAccept = async (actor) => {
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

    const config1 = {
      headers: {
        Authorization: auth,
      },
    };

    const doc = await axios.patch(
      "https://nofun.herokuapp.com/friendrequest/accept/",
      {
        actor,
        object: currentUser?.id,
      },
      config1
    );

    domains.map((d) => {
      if (d.domain.includes("t1")) {
        auth = d.auth;
      }
    });

    const config2 = {
      headers: {
        Authorization: auth,
      },
    };

    if (actor.includes("t1")) {
      await axios.put(
        "https://social-distribution-t1.herokuapp.com/author/" +
          actor.split("/")[4] +
          "/friends/" +
          currentUser?.id.split("/")[4] +
          "/",
        { remote: true },
        config2
      );
    }

    if (doc) {
      this.componentDidMount();
    }
  };

  handleDecline = async (actor) => {
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
        Authorization: auth,
      },
    };

    const doc = await axios.patch(
      "https://nofun.herokuapp.com/friendrequest/decline/",
      {
        actor,
        object: currentUser.id,
      },
      config
    );

    if (doc.data) {
      this.componentDidMount();
    }
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };

  renderPages = () => {
    const {
      value,
      likes,
      posts,
      comments,
      githubAcivities,
      requests,
      postPage,
      commentPage,
      likePage,
      githubPage,
      requestpage,
    } = this.state;
    let pages = 1;

    switch (value) {
      case 0:
        pages = Number(posts.length / 10);
        const array1 = [];
        for (let i = 0; i <= pages; i++) {
          array1.push(i);
        }
        return (
          <div style={{ marginLeft: "10%", marginRight: "10%" }}>
            {array1.map((page, i) => (
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
      case 1:
        pages = Number(comments.length / 10);
        const array2 = [];
        for (let i = 0; i <= pages; i++) {
          array2.push(i);
        }
        return (
          <div style={{ marginLeft: "10%", marginRight: "10%" }}>
            {array2.map((page, i) => (
              <Button
                value={i + 1}
                style={{ height: "30px" }}
                color={i + 1 === commentPage ? "primary" : "default"}
                variant="contained"
                onClick={(e) => this.setState({ commentPage: i + 1 })}
              >
                {i + 1}
              </Button>
            ))}
          </div>
        );
      case 2:
        pages = Number(likes.length / 10);
        const array3 = [];
        for (let i = 0; i <= pages; i++) {
          array3.push(i);
        }
        return (
          <div style={{ marginLeft: "10%", marginRight: "10%" }}>
            {array3.map((page, i) => (
              <Button
                value={i + 1}
                style={{ height: "30px" }}
                color={i + 1 === likePage ? "primary" : "default"}
                variant="contained"
                onClick={(e) => this.setState({ likePage: i + 1 })}
              >
                {i + 1}
              </Button>
            ))}
          </div>
        );
      case 3:
        pages = Number(requests.length / 10);
        const array4 = [];
        for (let i = 0; i <= pages; i++) {
          array4.push(i);
        }
        return (
          <div style={{ marginLeft: "10%", marginRight: "10%" }}>
            {array4.map((page, i) => (
              <Button
                value={i + 1}
                style={{ height: "30px" }}
                color={i + 1 === requestpage ? "primary" : "default"}
                variant="contained"
                onClick={(e) => this.setState({ requestpage: i + 1 })}
              >
                {i + 1}
              </Button>
            ))}
          </div>
        );
      case 4:
        pages = Number(githubAcivities.length / 10);
        const array5 = [];
        for (let i = 0; i <= pages; i++) {
          array5.push(i);
        }
        return (array5.map((page, i) => (
          <Button
            value={i + 1}
            color={i + 1 === githubPage ? "primary" : "default"}
            variant="contained"
            onClick={(e) => this.setState({ githubPage: i + 1 })}
          >
            {i + 1}
          </Button>
        )));
      default:
        return null;
    }
  };

  a11yProps = (index) => {
    return {
      id: `vertical-tab-${index}`,
      "aria-controls": `vertical-tabpanel-${index}`,
    };
  };

  handleClearInbox = async () => {
    const { currentUser, domains } = this.props;
    let auth = null;
    domains.map((d) => {
      if (d.domain.includes("nofun")) {
        auth = d.auth;
      }
    });

    const config = {
      headers: {
        Authorization: auth,
      },
    };
    await axios.delete(currentUser?.id + "/inbox/", config);
    this.componentDidMount();
  };

  render() {
    let {
      requests,
      posts,
      likes,
      comments,
      githubAcivities,
      value,
      postPage,
      commentPage,
      likePage,
      githubPage,
      requestpage,
    } = this.state;
    posts = posts.slice((postPage - 1) * 10, postPage * 10);
    comments = comments.slice((commentPage - 1) * 10, commentPage * 10);
    likes = likes.slice((likePage - 1) * 10, likePage * 10);
    githubAcivities = githubAcivities.slice(
      (githubPage - 1) * 10,
      githubPage * 10
    );
    requests = requests.slice((requestpage - 1) * 10, requestpage * 10);

    return (
      <div style={{
        backgroundImage: `url("https://images.pexels.com/photos/747964/pexels-photo-747964.jpeg")`, 
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: window.innerHeight,
      }}>
        <Header />
        <div
          style={{
            marginLeft: "15%",
            marginRight: "15%",
            marginTop: "2%",
            display: "flex",
            height: window.innerHeight * 0.8,
            width: window.innerWidth * 0.8
          }}
        >
          <Tabs
            value={value}
            onChange={this.handleChange}
            aria-label="tabs"
            orientation="vertical"
            variant="scrollable"
            style={{
              paddingRight: "2%",
              fontFamily: "monospace", fontSize: 20, color: "black"
            }}
          >
            <Tab label="posts" {...this.a11yProps(0)} style={{ backgroundColor: "#CCFFFF" }}/>
            <Tab label="comments" {...this.a11yProps(1)} style={{ backgroundColor: "#CCFFFF" }}/>
            <Tab label="likes" {...this.a11yProps(2)} style={{ backgroundColor: "#CCFFFF" }}/>
            <Tab label="Friend Requsets" {...this.a11yProps(3)} style={{ backgroundColor: "#CCFFFF" }}/>
            <Tab label="Github Activity" {...this.a11yProps(4)} style={{ backgroundColor: "#CCFFFF" }}/>
          </Tabs>
          <TabPanel value={value} index={0} style={{overflowY: "scroll", position: "relative", left: "10%"}}>
            <Grid
              container
              spacing={5}
              direction="horizenol"
              alignItems="flex-start"
            >
              <Grid item xs={12}>
                {posts?.length >= 1 ? (
                  posts.map((post) => (
                    <Card
                      style={{
                        marginTop: "2%",
                        width: "80%",
                        marginLeft: "10%",
                      }}
                    >
                      <CardActions
                        onClick={() =>
                          (window.location =
                            "/posts/" +
                            post.postId.split("/")[2] +
                            "/" +
                            post.postId.split("/")[4] +
                            "/" +
                            post.postId.split("/")[6] +
                            "/")
                        }
                      >
                        <p>
                          <b>{post.author.displayName}</b> created a post (click
                          to check it)
                        </p>
                        {post.contentType.includes("image") ? (
                          <img src={post.content} style={{ width: "80%" }} />
                        ) : (
                          <p>
                            <b>Title</b>: {post.title}
                          </p>
                        )}
                      </CardActions>
                    </Card>
                  ))
                ) : (
                  <h7>
                    You have not had any post created by your friends yet!
                  </h7>
                )}
              </Grid>
            </Grid>
          </TabPanel>
          <TabPanel value={value} index={1} style={{overflowY: "scroll", position: "relative", left: "10%"}}>
            <Grid
              container
              spacing={2}
              direction="horizenol"
              alignItems="flex-start"
            >
              <Grid item xs={12}>
                {comments?.length >= 1 ? (
                  comments.map((comment) => (
                    <Card
                      style={{
                        marginTop: "2%",
                        width: "80%",
                        marginLeft: "10%",
                      }}
                    >
                      <CardActions
                        onClick={() =>
                          (window.location =
                            "/posts/" +
                            comment.postId.split("/")[2] +
                            "/" +
                            comment.postId.split("/")[4] +
                            "/" +
                            comment.postId.split("/")[6] +
                            "/")
                        }
                      >
                        <p>
                          <b>{comment.author.displayName}</b> created a comment
                          on your post (click to check it)
                        </p>
                        <p>
                          <b>Content</b>: {comment.comment}
                        </p>
                      </CardActions>
                    </Card>
                  ))
                ) : (
                  <h7>You have not received any comment from other user!</h7>
                )}
              </Grid>
            </Grid>
          </TabPanel>
          <TabPanel value={value} index={2} style={{overflowY: "scroll", position: "relative", left: "10%"}}>
            <Grid
              container
              spacing={2}
              direction="horizenol"
              alignItems="flex-start"
            >
              <Grid item xs={12}>
                {likes?.length >= 1 ? (
                  likes.map((like) => (
                    <Card
                      style={{
                        marginTop: "2%",
                        width: "80%",
                        marginLeft: "10%",
                      }}
                    >
                      <CardActions
                        onClick={() =>
                          (window.location =
                            "/posts/" +
                            like.objectId.split("/")[2] +
                            "/" +
                            like.objectId.split("/")[4] +
                            "/" +
                            like.objectId.split("/")[6] +
                            "/")
                        }
                      >
                        <p>
                          <b>{like.author.displayName}</b> liked your{" "}
                          {like.comment ? "comment" : "post"} (click to check
                          it)
                        </p>
                      </CardActions>
                    </Card>
                  ))
                ) : (
                  <h7>You have not received any like!</h7>
                )}
              </Grid>
            </Grid>
          </TabPanel>
          <TabPanel value={value} index={3} style={{overflowY: "scroll", position: "relative", left: "10%"}}>
            <Grid>
              {requests?.length >= 1 ? (
                requests.map((doc) => (
                  <Card style={{ marginBottom: "2%", width: "100%" }}>
                    <CardActions>
                      <h7>
                        {doc.name} has sent you {""}
                        <b style={{ color: "blue" }}>friend request</b>{" "}
                      </h7>
                      <Button
                        size="medium"
                        variant="outlined"
                        color="secondary"
                        style={{ marginLeft: "30%" }}
                        onClick={() => {
                          this.handleAccept(doc.actor, doc.actor.split("/")[2]);
                        }}
                      >
                        Accept
                      </Button>
                      <Button
                        size="medium"
                        variant="outlined"
                        color="secondary"
                        onClick={() =>
                          this.handleDecline(doc.actor, doc.actor.split("/")[2])
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
          </TabPanel>
          <TabPanel value={value} index={4} style={{overflowY: "scroll"}}>
            <Grid
              container
              spacing={2}
              direction="horizenol"
              alignItems="flex-start"
            >
              <Grid item xs={12}>
                {githubAcivities?.length >= 1 ? (
                  githubAcivities.map((activity) => (
                    <Card
                      style={{
                        marginTop: "2%",
                        width: "80%",
                        marginLeft: "10%",
                      }}
                    >
                      <CardActions
                        onClick={() => (window.location = activity.repo.url)}
                      >
                        <Avatar src={activity.actor.avatar_url} />
                        <p>Time: {activity.created_at.split("T")[0]}</p>
                        <p>Activity: {activity.type}</p>
                      </CardActions>
                    </Card>
                  ))
                ) : (
                  <h7>
                    You do not have github activity or you have not verify your
                    github accuont!
                  </h7>
                )}
              </Grid>
            </Grid>
          </TabPanel>
        </div>
        <div
          id="page"
          style={{ display: "flex", flexDirection: "row",  bottom: 0, left: "5%" }}
        >
          {value !== 4 && (
            <Button
              color="secondary"
              variant="contained"
              onClick={this.handleClearInbox}
              style={{
                position: "fixed",
                right: "5%",
                bottom: "3%"
              }}
            >
              Clear Inbox
            </Button>
          )}
          <div style={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            position: "fixed",
            left: "35%",
            bottom: "3%"
          }}>
            {this.renderPages()}
          </div>
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
