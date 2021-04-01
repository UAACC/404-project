import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import FavoriteIcon from "@material-ui/icons/Favorite";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import Paper from "@material-ui/core/Paper";
import Cookies from "js-cookie";
import { connect } from "react-redux";
import axios from "axios";
import Grid from "@material-ui/core/Grid";

class CommentCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      comment: this.props.comment,
      author: null,
    };
  }

  componentDidMount = async () => {
    const { domain, authorId, postId } = this.state;

    const config = {
      headers: {
        Authorization: "Basic UmVtb3RlMTpyZW1vdGUxMjM0",
      },
    };

    const doc = await axios.get(
      "https://" + domain + "/author/" + authorId + +"/",
      config
    );

    this.setState({ author: doc.data });
  };

  handleLike = async () => {
    var { comment } = this.state;
    const { token } = this.props.currentUser;
    const csrftoken = Cookies.get("csrftoken");
    const config = {
      headers: {
        Authorization: "Basic UmVtb3RlMTpyZW1vdGUxMjM0",
        "X-CSRFToken": csrftoken,
        "Content-Type": "application/json",
      },
    };

    await axios.post(comment.id + "/likes/", config);
  };

  handleDelete = async () => {
    const { comment } = this.state;
    const { domain, authorId, postId } = this.state;

    const csrftoken = Cookies.get("csrftoken");
    const config = {
      headers: {
        Authorization: "Basic UmVtb3RlMTpyZW1vdGUxMjM0",
        "X-CSRFToken": csrftoken,
        "Content-Type": "application/json",
      },
    };

    await axios.delete(comment.id, config);

    this.props.handleClick();
  };

  render() {
    const { author, comment } = this.state;
    const { currentUser } = this.props;
    return (
      <Grid
        container
        spacing={2}
        direction="horizenol"
        justify="center"
        alignItems="flex-start"
      >
        <Grid item xs={8}>
          <Card>
            <CardContent>
              <div className="row">
                <div className="col-9">
                  <Typography variant="body1" component="h4">
                    User Name:{" "}
                    <b>{author ? author.displayName : "Loading ... "}</b>
                  </Typography>
                  <Typography variant="body1" component="h4">
                    Content: {comment ? comment.comment : "Loading ... "}
                  </Typography>
                </div>
                <div className="col-3">
                  <IconButton
                    style={{ marginLeft: "50%", width: "40px", htight: "40px" }}
                    onClick={this.handleLike}
                  >
                    <FavoriteIcon color="secondary" size="large" />
                  </IconButton>
                  {currentUser && currentUser.id === comment.author ? (
                    <div>
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={this.handleDelete}
                      >
                        Delete
                      </Button>
                    </div>
                  ) : null}
                </div>
              </div>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );
  }
}

const mapStateToProps = (state) => ({
  currentUser: state.user.currentUser,
});

export default connect(mapStateToProps)(CommentCard);
