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
    await this.handleLikeInbox(config);
    await this.handleGithubActivities(currentUser?.github);
  };

  handleGithubActivities = async (github) => {
    const octokit = new Octokit({
      auth: `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`,
    });
    let doc = null;
    if (github) {
      doc = await octokit.request(
        "GET /users/" + github.split("/")[3] + "/events"
      );
    }

    this.setState({ githubAcivities: doc ? doc.data : [] });
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
    let res;
    //literate through items and append displayname to each item
    if (requests.length !== 0) {
      const ApiRequests = requests.map((req) => {
        if (req.actor.includes("nofun")) {
          return axios.get(req.actor, config);
        } else {
          // TODO: if the author is from team 17
        }
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
      const stuff = item.items.split(",");
      const type = stuff[0].split("'")[3];

      if (type === "post") {
        const title = stuff[1]?.split("'")[3];
        const contentType = stuff[5]?.split("'")[3];
        const content = stuff[6]?.split("'")[3];
        const authorId = stuff[7]?.split("'")[3];
        const postId = stuff[14]?.split("'")[3];
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
      const stuff = item.items.split(",");
      const type = stuff[0].split("'")[3];

      if (type === "comment") {
        const authorId = stuff[1]?.split("'")[3];
        const postId = stuff[2]?.split("'")[3];
        const comment = stuff[3]?.split("'")[3];
        const commentId = stuff[5]?.split("'")[3];
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
      const stuff = item.items.split(",");
      const type = stuff[0].split("'")[3];
      console.log(stuff);
      if (type === "Like") {
        const authorId = stuff[2]?.split("'")[3];
        console.log(authorId);
        const objectId = stuff[3]?.split("'")[3];
        return {
          authorId,
          objectId,
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
  handleAccept = async (actor, from_user_domain) => {
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
      "https://" + from_user_domain + "/friendrequest/accept/",
      {
        actor,
        object: currentUser?.id,
      },
      config
    );

    if (doc) {
      this.componentDidMount();
    }
  };

  handleDecline = async (actor, from_user_domain) => {
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
      "https://" + from_user_domain + "/friendrequest/decline/",
      {
        actor,
        object: currentUser.id,
      },
      config
    );

    if (doc) {
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
        return (
          <div style={{ marginLeft: "10%", marginRight: "10%" }}>
            {array5.map((page, i) => (
              <Button
                value={i + 1}
                style={{ height: "30px" }}
                color={i + 1 === githubPage ? "primary" : "default"}
                variant="contained"
                onClick={(e) => this.setState({ githubPage: i + 1 })}
              >
                {i + 1}
              </Button>
            ))}
          </div>
        );
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
    console.log("clear");
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
            value={value}
            onChange={this.handleChange}
            aria-label="tabs"
            orientation="vertical"
            variant="scrollable"
            style={{
              paddingRight: "2%",
            }}
          >
            <Tab label="posts" {...this.a11yProps(0)} />
            <Tab label="comments" {...this.a11yProps(1)} />
            <Tab label="likes" {...this.a11yProps(2)} />
            <Tab label="Friend Requsets" {...this.a11yProps(3)} />
            <Tab label="Github Activity" {...this.a11yProps(4)} />
          </Tabs>

          <TabPanel value={value} index={0}>
            <Grid
              container
              spacing={2}
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
          <TabPanel value={value} index={1}>
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
          <TabPanel value={value} index={2}>
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
                          <b>{like.author.displayName}</b> liked your
                          post/comment (click to check it)
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
          <TabPanel value={value} index={3}>
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
          <TabPanel value={value} index={4}>
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
        <Button
          color="secondary"
          variant="contained"
          onClick={this.handleClearInbox}
          style={{
            marginTop: "1%",
            marginLeft: "21%",
            marginBottom: "3%",
          }}
        >
          Clear Inbox
        </Button>

        <div
          id="page"
          style={{ display: "flex", flexDirection: "row", marginBottom: "5%" }}
        >
          {this.renderPages()}
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
