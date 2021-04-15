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
import { connect } from "react-redux";
import axios from "axios";
import Grid from "@material-ui/core/Grid";
import ReactMarkdown from "react-markdown";


class CommentCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      comment: this.props.comment,
      author: null,
      likes: []
    };
  }

  componentDidMount = async () => {
    const { comment } = this.state;
    const { domains } = this.props;
    let auth = null;

    domains?.map(d => {
      if (d.domain === comment.author.split("/")[2]) {
        auth = d.auth;
      }
    })

    const config = {
      headers: {
        "Authorization": auth,
      },
    };

    const doc = await axios.get(
      comment.author + "/",
      config
    );

    const likeDoc = await axios.get(
      comment.id + "/likes/",
      config
    )

    this.setState({ author: doc.data, likes: likeDoc.data });
  };

  handleLike = async () => {
    const { comment } = this.state;
    const { domains, currentUser } = this.props;

    let auth = null;

    domains.map(d => {
      if (d.domain === comment.author.split("/")[2]) {
        auth = d.auth;
      }
    })

    const config = {
      headers: {
        "Authorization": auth,
      },
    };

    await axios.post(comment.id + "/likes/", { author: currentUser?.id }, config);
    this.componentDidMount();
  };

  render() {
    const { author, comment, likes } = this.state;
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
                    <b>{author?.displayName}</b>
                  </Typography>
                  <Typography variant="body1" component="h4">
                    <Typography>Content: <ReactMarkdown>{comment ? comment.comment : "Loading ... "}</ReactMarkdown></Typography>
                  </Typography>
                </div>
                <div className="col-3">
                  <IconButton
                    style={{ marginLeft: "50%", width: "40px", htight: "40px" }}
                    onClick={this.handleLike}
                  >
                    <FavoriteIcon color="secondary" size="large" />
                    {comment.author === currentUser?.id && likes.length}
                  </IconButton>
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
  domains: state.domain.domains
});

export default connect(mapStateToProps)(CommentCard);
