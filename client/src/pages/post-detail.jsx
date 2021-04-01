import React from "react";
import Posting from "../components/Posting";
import CommentCard from "../components/commentCard";
import CommentForm from "../components/commentForm";
import profileee from "../components/ProfileComponent";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import HourglassEmptyIcon from "@material-ui/icons/HourglassEmpty";
import axios from "axios";
import AccountBoxIcon from "@material-ui/icons/AccountBox";
import DescriptionIcon from "@material-ui/icons/Description";
import EventNoteIcon from "@material-ui/icons/EventNote";
import ClosedCaptionIcon from "@material-ui/icons/ClosedCaption";
import ShareIcon from "@material-ui/icons/Share";
import FavoriteIcon from "@material-ui/icons/Favorite";
import IconButton from "@material-ui/core/IconButton";
import CommentIcon from "@material-ui/icons/Comment";
import { Container, TextField, Avatar } from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import Header from "../components/Header";

import { connect } from "react-redux";
import Cookies from "js-cookie";

class PostDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      post: null,
      author: null,
      comments: [],
      authorsList: [],
      title: "",
      content: "",
      commentOpen: false,
      editOpen: false,
      domain: props.match.params.domain,
      authorId: props.match.params.authorId,
      postId: props.match.params.postId,
    };
  }

  componentDidMount = async () => {
    //set post's information in state
    const { currentUser } = this.props;
    const { domain, authorId, postId } = this.state;

    const config = {
      headers: {
        Authorization: "Basic UmVtb3RlMTpyZW1vdGUxMjM0",
      },
    };

    const doc = await axios.get(
      "https://" + domain + "/author/" + authorId + "/posts/" + postId + "/",
      config
    );
    const post = doc.data;

    if (
      post.visibility === "PUBLIC" ||
      (post.visibility === "PUBLIC" && post.author === currentUser?.id)
    ) {
      this.setState({ post, title: post.title, content: post.content });
    }

    const doc2 = await axios.get(post.comments, config);
    this.setState({ comments: doc2.data });

    //match user's id with the postid to fetch author's username
    const authorDoc = await axios.get(
      "https://" + domain + "/author/" + authorId + "/",
      config
    );
    const author = authorDoc.data;

    this.setState({ author });
  };

  getAllComments = () => {
    const { comments } = this.state;
    const { domain, authorId, postId } = this.state;

    return (
      <Container style={{ marginTop: "2%" }}>
        {comments.length !== 0 ? (
          comments.map((comment) => (
            <CommentCard
              comment={comment}
              domain={domain}
              authorId={authorId}
              postId={postId}
              handleClick={this.componentDidMount}
            />
          ))
        ) : (
          <center>
            <Typography variant="h7" style={{ marginLeft: 20 }}>
              there's no comment yet
            </Typography>
          </center>
        )}
      </Container>
    );
  };

  handleLike = async () => {
    var { post } = this.state;
    const { token } = this.props.currentUser;
    const csrftoken = Cookies.get("csrftoken");
    const config = {
      headers: {
        Authorization: "Basic UmVtb3RlMTpyZW1vdGUxMjM0",
        "X-CSRFToken": csrftoken,
        "Content-Type": "application/json",
      },
    };

    await axios.post(post.id + "/likes/", config);
    this.componentDidMount();
  };

  renderEdit = () => {
    const { post } = this.state;
    const user = this.props.currentUser;
    const likesToPost = post.likes;
    //看当前user有没有喜欢这个post
    const currentLike = likesToPost.filter((like) => like.author === user.id);
    if (currentLike.length != 0) {
      return <EditIcon size="large" />;
    } else {
      return <EditIcon />;
    }
  };

  handleEdit = () => {
    const { post } = this.state;
    const { id } = this.props.currentUser;
    if (id === post.author) {
      this.setState({ editOpen: !this.state.editOpen });
    }
  };

  handleSubmitEdit = async () => {
    const { post, title, content } = this.state;
    const { token } = this.props.currentUser;
    const csrftoken = Cookies.get("csrftoken");
    const config = {
      headers: {
        Authorization: `Token ${token}`,
        "X-CSRFToken": csrftoken,
        "Content-Type": "application/json",
      },
    };
    await axios.patch(post.id + "/", { title, content }, config);
    this.componentDidMount();
  };

  handleDelete = async () => {
    const { post } = this.state;
    const { token } = this.props.currentUser;
    const csrftoken = Cookies.get("csrftoken");
    const config = {
      headers: {
        Authorization: `Token ${token}`,
        "X-CSRFToken": csrftoken,
        "Content-Type": "application/json",
      },
    };
    await axios.delete(post.id + "/", config);
    window.location = "/posts/";
  };

  render() {
    const { domain, authorId, postId } = this.state;
    const { post, title, content, editOpen, commentOpen, author } = this.state;
    const { currentUser } = this.props;
    return (
      <div>
        <Header />
        <div
          style={{ marginLeft: "10%", marginRight: "10%", marginTop: "30px" }}
        >
          {post ? (
            <Grid
              container
              spacing={4}
              direction="horizenol"
              justify="center"
              alignItems="flex-start"
            >
              <Grid item xs={8}>
                <Paper>
                  <div
                    style={{
                      marginLeft: "7%",
                      marginRight: "7%",
                      paddingTop: "3%",
                    }}
                  >
                    <Typography variant="h6">{author?.displayName}</Typography>
                    <Typography>{post.published.split("T")[0]}</Typography>
                    <Typography>Type: {post.contentType}</Typography>
                    {post.contentType.includes("image") && (
                      <img src={post.content} style={{ width: "500px" }} />
                    )}
                    {editOpen ? (
                      <TextField
                        label="Titile"
                        value={title}
                        onChange={(e) =>
                          this.setState({ title: e.target.value })
                        }
                      />
                    ) : (
                      <Typography variant="h5" style={{ paddingTop: "5%" }}>
                        {post.title}
                      </Typography>
                    )}
                    {editOpen ? (
                      <TextField
                        label="content"
                        value={content}
                        onChange={(e) =>
                          this.setState({ content: e.target.value })
                        }
                      />
                    ) : (
                      <Typography>{post.content}</Typography>
                    )}
                  </div>
                  <br />
                  <br />
                </Paper>
              </Grid>
            </Grid>
          ) : (
            <center>
              <HourglassEmptyIcon fontSize="small"></HourglassEmptyIcon>
              <Typography variant="h7" style={{ marginLeft: 20 }}>
                The post does not exit OR You do not have the permission to see
                this post!
              </Typography>
            </center>
          )}
          {post ? (
            <div style={{ marginTop: "20px" }}>
              <IconButton
                style={{ marginLeft: "17%" }}
                onClick={this.handleLike}
              >
                <FavoriteIcon color="secondary" size="large" />
              </IconButton>
              <IconButton
                style={{ marginLeft: "3%" }}
                onClick={() =>
                  this.setState({ commentOpen: !this.state.commentOpen })
                }
              >
                <CommentIcon></CommentIcon>
              </IconButton>
              <IconButton style={{ marginLeft: "50%" }}></IconButton>
              <ShareIcon></ShareIcon>

              {currentUser && currentUser.id === post.author ? (
                editOpen ? (
                  <IconButton
                    style={{ marginLeft: "10%", color: "green" }}
                    onClick={this.handleSubmitEdit}
                  >
                    V
                  </IconButton>
                ) : (
                  <IconButton
                    style={{ marginLeft: "10%" }}
                    onClick={this.handleEdit}
                  >
                    {this.renderEdit()}
                  </IconButton>
                )
              ) : null}
              {currentUser && currentUser.id === post.author ? (
                <IconButton
                  style={{ marginLeft: "10%", color: "red" }}
                  onClick={this.handleDelete}
                >
                  X
                </IconButton>
              ) : null}
              {commentOpen ? (
                <div>
                  <CommentForm
                    post={post}
                    handleClick={this.componentDidMount}
                  />
                </div>
              ) : null}
              {this.getAllComments()}
              <br />
              <br />
            </div>
          ) : null}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  currentUser: state.user.currentUser,
});

export default connect(mapStateToProps)(PostDetail);
