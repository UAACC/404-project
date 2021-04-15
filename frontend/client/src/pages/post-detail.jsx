import React from "react";
import CommentCard from "../components/commentCard";
import CommentForm from "../components/commentForm";
import Typography from "@material-ui/core/Typography";
import HourglassEmptyIcon from "@material-ui/icons/HourglassEmpty";
import axios from "axios";
import Chip from "@material-ui/core/Chip";
import ShareIcon from "@material-ui/icons/Share";
import FavoriteIcon from "@material-ui/icons/Favorite";
import IconButton from "@material-ui/core/IconButton";
import CommentIcon from "@material-ui/icons/Comment";
import { Container, TextField } from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import Header from "../components/Header";
import { connect } from "react-redux";
import Radio from "@material-ui/core/Radio";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import ReactMarkdown from "react-markdown";


class PostDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      post: null,
      author: null,
      comments: [],
      authorsList: [],
      likes: [],
      title: "",
      content: "",
      description: "",
      commentOpen: false,
      editOpen: false,
      imageLocal: true,
      categories: [],
      currCategory: "",
      domain: props.match.params.domain,
      authorId: props.match.params.authorId,
      postId: props.match.params.postId,
    };
  }

  componentDidMount = async () => {
    const { currentUser, domains, userFriends } = this.props;
    const { domain, authorId, postId } = this.state;
    let auth = null;
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

    const post_id =
      "https://" + domain + "/author/" + authorId + "/posts/" + postId + "/";

    const doc = await axios.get(post_id, config);

    let post = null;
    if (doc.data.length === undefined) {
      post = doc.data;
    } else {
      post = doc.data[0];
    }
    console.log(post);
    if (
      post?.visibility === "PUBLIC" ||
      post?.visibility === "UNLISTED" ||
      post?.author === currentUser?.id ||
      post?.author?.id === currentUser?.id ||
      (post?.visibility === "FRIENDS" &&
        (userFriends?.includes(post?.author) ||
          userFriends?.includes(post?.author.id))) ||
      (post?.visibility !== "FRIENDS" &&
        post?.visibility !== "UNLISTED" &&
        JSON.parse(post?.visibility).includes(currentUser?.displayName))
    ) {
      const { categories, contentType, title, content, description } = post;
      if (Array.isArray(post.categories)) {
        this.setState({
          post,
          categories,
          contentType,
          title,
          content,
          description,
        });
      } else {
        this.setState({
          post,
          categories: JSON.parse(categories),
          contentType,
          title,
          content,
          description,
        });
      }
    }

    const doc2 = await axios.get(post_id + "comments/", config);
    this.setState({ comments: doc2.data });

    const authorDoc = await axios.get(
      "https://" + domain + "/author/" + authorId + "/",
      config
    );
    const author = authorDoc.data;

    this.setState({ author });

    // get likes
    const likeDoc = await axios.get(post_id + "likes/", config);
    this.setState({ likes: likeDoc.data });
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
    const { domains, currentUser } = this.props;
    const { domain, post } = this.state;
    let auth = null;

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

    if (domain === "social-distribution-t1.herokuapp.com") {
      try {
        await axios.post(
          post.id + "/likes/",
          {
            displayName: currentUser.displayName,
            actor: currentUser?.id,
            context: post.id,
            object: post.id,
            type: "like",
            summary: "like from team one",
          },
          config
        );

        await axios.post("https://social-distribution-t1.herokuapp.com/author/"+ post.id.split("/")[4] + "/inbox/", {
          remote: true,
          author: {
            displayName: currentUser.displayName,
            id: currentUser.id,
            github: currentUser.github,
            url: currentUser.url,
            host: currentUser.host
          },
          type: "Like",
          object: post.id,
          title: post.title,
          description: post.description,
          content: post.content,
          contentType: post.contentType,
          published: post.published,
          author: post.author,
          categories: post.categories,
          unlisted: post.unlisted,
          visibility: post.visibility
        }, config);


        this.componentDidMount();
      } catch {
        window.alert("like team1 goes wrong, please try later");
      }
    } else {
      try {
        await axios.post(
          post.id + "/likes/",
          { actor: currentUser?.id, author: currentUser?.id },
          config
        );
        window.alert("Liked!");
        this.componentDidMount();
      } catch {
        window.alert("Something wrong, please try later!");
      }
    }
  };

  handleShare = async () => {
    const { post } = this.state;
    const { domains, currentUser } = this.props;

    let auth = null;
    domains.map((d) => {
      if (d.domain === currentUser?.id?.split("/")[2]) {
        auth = d.auth;
      }
    });

    const config = {
      headers: {
        Authorization: auth,
      },
    };

    const doc = await axios.post(
      currentUser?.id + "/posts/",
      {
        title: post.title,
        source: post.id,
        origin: post.origin,
        count: post.count,
        size: post.size,
        description: post.description,
        content: post.content,
        visibility: post.visibility,
        unlisted: post.unlisted,
        contentType: post.contentType,
        published: new Date(),
        author: currentUser?.id,
        categories: post.categories,
      },
      config
    );

    if (doc.data?.id) {
      window.location = `/posts/nofun.herokuapp.com/${
        currentUser?.id.split("/")[4]
      }/${doc.data.id.split("/")[6]}/`;
    }
  };

  encodeFileBase64 = (file) => {
    var reader = new FileReader();
    if (file) {
      reader.readAsDataURL(file);
      reader.onload = () => {
        var Base64 = reader.result;
        this.setState({ content: Base64 });
      };
      reader.onerror = (error) => {
        console.log("error: ", error);
      };
    }
  };

  handleEdit = () => {
    const { post } = this.state;
    const { id } = this.props.currentUser;
    if (id === post.author || id === post.author.id) {
      this.setState({ editOpen: !this.state.editOpen });
    }
  };

  handleSubmitEdit = async () => {
    const {
      post,
      title,
      content,
      description,
      domain,
      authorId,
      postId,
      categories,
    } = this.state;
    const { domains } = this.props;
    let auth = null;
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

    console.log("content: ", content);

    await axios.put(
      post.id + "/",
      {
        ...post,
        title,
        description,
        content,
        categories: JSON.stringify(categories),
      },
      config
    );
    window.location = "/posts/" + domain + "/" + authorId + "/" + postId;
  };

  handleDelete = async () => {
    const { post, domain } = this.state;
    const { domains } = this.props;

    let auth = null;
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

    await axios.delete(post.id + "/", config);
    window.location = "/";
  };

  render() {
    const {
      likes,
      currCategory,
      categories,
      imageLocal,
      post,
      title,
      contentType,
      description,
      content,
      editOpen,
      commentOpen,
      author,
      domain,
      authorId,
      postId,
    } = this.state;
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
                <Typography
                  style={{
                    color: "blue",
                    marginLeft: "5%",
                    marginBottom: "5px",
                  }}
                >
                  {post.author.id ===
                    post.origin.split("/")[0] +
                      "/" +
                      post.origin.split("/")[1] +
                      "/" +
                      post.origin.split("/")[2] +
                      "/" +
                      post.origin.split("/")[3] +
                      "/" +
                      post.origin.split("/")[4] ||
                  post.author ===
                    post.origin.split("/")[0] +
                      "/" +
                      post.origin.split("/")[1] +
                      "/" +
                      post.origin.split("/")[2] +
                      "/" +
                      post.origin.split("/")[3] +
                      "/" +
                      post.origin.split("/")[4]
                    ? "Original"
                    : "Shared"}
                </Typography>
                {contentType !== "image" ? (
                  <Paper>
                    <div
                      style={{
                        marginLeft: "5%",
                        marginRight: "5%",
                        paddingTop: "3%",
                      }}
                    >
                      <Typography variant="h6">
                        {author?.displayName}
                      </Typography>
                      <Typography variant="subtitle2">
                        {post.published.split("T")[0]}
                      </Typography>
                      <Typography>Type: {post.contentType}</Typography>
                      {post.contentType.includes("image") && !editOpen && (
                        <img
                          src={post.content}
                          style={{ width: "500px" }}
                          onClick={() => {
                            window.location =
                              "/posts/" +
                              domain +
                              "/" +
                              authorId +
                              "/" +
                              postId +
                              "/image/";
                          }}
                        />
                      )}
                      {editOpen ? (
                        <TextField
                          label="Titile"
                          value={title}
                          style={{ marginRight: "5%", marginTop: "3%" }}
                          onChange={(e) =>
                            this.setState({ title: e.target.value })
                          }
                        />
                      ) : (
                        <Typography variant="h5" style={{ paddingTop: "5%" }}>
                          Title: {post.title}
                        </Typography>
                      )}
                      {contentType.includes("image") &&
                        (editOpen ? (
                          <TextField
                            label="description"
                            style={{ marginRight: "5%", marginTop: "3%" }}
                            value={description}
                            onChange={(e) =>
                              this.setState({ description: e.target.value })
                            }
                          />
                        ) : (
                          <Typography>
                            Description: {post.description}
                          </Typography>
                        ))}
                      {contentType.includes("image") ? (
                        editOpen && (
                          <div className="row" id="image">
                            <div>
                              <FormControl
                                component="fieldset"
                                style={{
                                  marginRight: "3%",
                                  marginTop: "3%",
                                  width: "94%",
                                }}
                                onChange={(e) => {
                                  this.setState({
                                    imageLocal: e.target.value === "true",
                                  });
                                }}
                              >
                                <FormLabel component="legend">
                                  How do you want to upload the image?
                                </FormLabel>
                                <RadioGroup
                                  row
                                  aria-label="visible"
                                  name="visible"
                                >
                                  <FormControlLabel
                                    value={"true"}
                                    checked={imageLocal}
                                    control={<Radio />}
                                    label="Local Image"
                                  />
                                  <FormControlLabel
                                    value={"false"}
                                    checked={!imageLocal}
                                    control={<Radio />}
                                    label="URL"
                                  />
                                </RadioGroup>
                              </FormControl>
                            </div>
                            {imageLocal ? (
                              <div>
                                <FormLabel
                                  style={{
                                    marginTop: "3%",
                                    marginRight: "2%",
                                  }}
                                >
                                  Upload an Image from local machine
                                </FormLabel>
                                <input
                                  type="file"
                                  style={{ marginLeft: "20px" }}
                                  onChange={(e) =>
                                    this.encodeFileBase64(e.target.files[0])
                                  }
                                />
                              </div>
                            ) : (
                              <div>
                                <FormLabel
                                  style={{
                                    marginTop: "3%",
                                    marginRight: "2%",
                                  }}
                                >
                                  Input image URL
                                </FormLabel>
                                <TextField
                                  style={{ marginLeft: "20px" }}
                                  label="Image"
                                  onChange={(e) =>
                                    this.setState({ content: e.target.value })
                                  }
                                />
                              </div>
                            )}
                            {content && (
                              <div>
                                <img src={content} style={{ width: "40%" }} />
                                <IconButton
                                  style={{ marginLeft: "3%", color: "red" }}
                                  onClick={() => this.setState({ content: "" })}
                                >
                                  X
                                </IconButton>
                              </div>
                            )}
                          </div>
                        )
                      ) : editOpen ? (
                        <TextField
                          label="content"
                          value={content}
                          style={{ marginRight: "5%", marginTop: "3%" }}
                          onChange={(e) =>
                            this.setState({ content: e.target.value })
                          }
                        />
                      ) : (
                        <Typography>
                          Content: <ReactMarkdown>{post.content}</ReactMarkdown>
                        </Typography>
                      )}
                    </div>
                    <br />
                    <div id="category">
                      {!editOpen ? (
                        <div style={{ marginLeft: "5%", marginTop: "10px" }}>
                          {categories.length !== 0 &&
                            categories.map((cate, index) => (
                              <Chip
                                style={{ margin: "2px" }}
                                label={cate}
                                color="primary"
                              />
                            ))}
                        </div>
                      ) : (
                        <div>
                          <div style={{ marginLeft: "3%", marginTop: "10px" }}>
                            {categories.length !== 0 &&
                              categories.map((cate, index) => (
                                <Chip
                                  style={{ margin: "3px" }}
                                  label={cate}
                                  onDelete={() => {
                                    categories.splice(index, 1);
                                    this.setState({ categories });
                                  }}
                                  color="primary"
                                />
                              ))}
                          </div>
                          <TextField
                            onKeyDown={(key) => {
                              if (key.keyCode === 13) {
                                console.log("enter cate");
                                categories.push(currCategory);
                                this.setState({ categories, currCategory: "" });
                              }
                            }}
                            value={currCategory}
                            onChange={(e) =>
                              this.setState({ currCategory: e.target.value })
                            }
                            style={{
                              marginLeft: "3%",
                              marginRight: "3%",
                              marginTop: "3%",
                              width: "20%",
                            }}
                            id="category"
                            label="category"
                            variant="filled"
                          />
                        </div>
                      )}
                    </div>
                    <br />
                    <br />
                  </Paper>
                ) : (
                  <Paper>
                    {post.contentType.includes("image") && !editOpen && (
                      <img
                        src={post.content}
                        style={{ width: "500px" }}
                        onClick={() => {
                          window.location =
                            "/posts/" +
                            domain +
                            "/" +
                            authorId +
                            "/" +
                            postId +
                            "/image/";
                        }}
                      />
                    )}
                    {editOpen && (
                      <div
                        className="row"
                        id="image"
                        style={{ marginLeft: "3%", marginTop: "2%" }}
                      >
                        <FormControl
                          component="fieldset"
                          style={{
                            marginLeft: "3%",
                            marginRight: "3%",
                            marginTop: "3%",
                            width: "94%",
                          }}
                          onChange={(e) => {
                            this.setState({
                              imageLocal: e.target.value === "true",
                            });
                          }}
                        >
                          <FormLabel component="legend">
                            How do you want to upload the image?
                          </FormLabel>
                          <RadioGroup row aria-label="visible" name="visible">
                            <FormControlLabel
                              value={"true"}
                              checked={imageLocal}
                              control={<Radio />}
                              label="Local Image"
                            />
                            <FormControlLabel
                              value={"false"}
                              checked={!imageLocal}
                              control={<Radio />}
                              label="URL"
                            />
                          </RadioGroup>
                        </FormControl>
                        {imageLocal ? (
                          <div>
                            <FormLabel style={{ marginRight: "20px" }}>
                              Upload an Image from local machine
                            </FormLabel>
                            <input
                              type="file"
                              onChange={(e) =>
                                this.encodeFileBase64(e.target.files[0])
                              }
                            />
                          </div>
                        ) : (
                          <div>
                            <FormLabel
                              style={{
                                marginRight: "20px",
                              }}
                            >
                              Input image URL
                            </FormLabel>
                            <TextField
                              label="Image"
                              onChange={(e) =>
                                this.setState({ content: e.target.value })
                              }
                            />
                          </div>
                        )}
                        {content && (
                          <div>
                            <img src={content} style={{ width: "40%" }} />
                            <IconButton
                              style={{ marginLeft: "3%", color: "red" }}
                              onClick={() => this.setState({ content: "" })}
                            >
                              X
                            </IconButton>
                          </div>
                        )}
                      </div>
                    )}
                  </Paper>
                )}
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

          {post && (
            <div>
              <div style={{ marginTop: "2%" }}>
                <IconButton
                  style={{ marginLeft: "17%" }}
                  onClick={this.handleLike}
                >
                  <FavoriteIcon color="secondary" size="large" />
                  <Typography variant="h7" style={{ marginLeft: 20 }}>
                    {post.visibility !== "PUBLIC" && likes.length}
                  </Typography>
                </IconButton>
                <IconButton
                  style={{ marginLeft: "3%" }}
                  onClick={() =>
                    this.setState({ commentOpen: !this.state.commentOpen })
                  }
                >
                  <CommentIcon />
                </IconButton>
                {post.author !== currentUser?.id &&
                  post.author?.id !== currentUser?.id && (
                    <IconButton style={{ marginLeft: "3%" }}>
                      <ShareIcon onClick={this.handleShare} />
                    </IconButton>
                  )}

                {(post.author === currentUser?.id ||
                  post.author?.id === currentUser?.id) &&
                  (editOpen ? (
                    <IconButton
                      style={{ marginLeft: "3%", color: "green" }}
                      onClick={this.handleSubmitEdit}
                    >
                      V
                    </IconButton>
                  ) : (
                    <IconButton
                      style={{ marginLeft: "3%" }}
                      onClick={this.handleEdit}
                    >
                      <EditIcon size="large" />
                    </IconButton>
                  ))}
                {(post.author === currentUser?.id ||
                  post.author?.id === currentUser?.id) && (
                  <IconButton
                    style={{ marginLeft: "3%", color: "red" }}
                    onClick={this.handleDelete}
                  >
                    X
                  </IconButton>
                )}
              </div>
              {commentOpen && (
                <div>
                  <CommentForm
                    post={post}
                    handleClick={this.componentDidMount}
                  />
                </div>
              )}
              {this.getAllComments()}
              <br />
              <br />
            </div>
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  currentUser: state.user.currentUser,
  userFriends: state.user.userFriends,
  domains: state.domain.domains,
});

export default connect(mapStateToProps)(PostDetail);
