import React from "react";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import { Button } from "@material-ui/core";
import { connect } from "react-redux";
import axios from "axios";

class CommentForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      comment: "",
      post: props.post,
    };
  }

  handleSubmit = async (event) => {
    event.preventDefault();

    const { id } = this.props.currentUser;
    const { comment, post } = this.state;
    const { domains } = this.props;

    let auth = null;

    domains.map(d => {
      if (d.domain === post.id.split("/")[2]) {
        auth = d.auth;
      }
    })

    const config = {
      headers: {
        Authorization: auth,
      },
    };
    const doc = await axios.post(
      post.id + "/comments/",
      {
        type: "comment",
        comment,
        author: id,
        post: post.id,
        contentType: "text/plain"
      },
      config
    );
    if (doc.data) {
      this.props.handleClick();
    }
  };

  render() {
    const { comment } = this.state;
    return (
      <div>
        <form>
          <Grid
            container
            spacing={4}
            direction="horizenol"
            justify="center"
            alignItems="flex-start"
          >
            <Grid item xs={8}>
              <Paper style={{ height: "200px" }}>
                <div>
                  <TextField
                    onChange={(e) => {
                      this.setState({ comment: e.target.value });
                    }}
                    id="description"
                    name="description"
                    style={{
                      marginLeft: "3%",
                      marginRight: "3%",
                      marginTop: "3%",
                      width: "94%",
                    }}
                    label="comment section"
                    multiline
                    rows={3}
                    value={comment}
                    variant="outlined"
                  ></TextField>
                </div>
                <div>
                  <Button
                    onClick={this.handleSubmit}
                    variant="contained"
                    color="primary"
                    style={{
                      marginLeft: "3%",
                      marginTop: "3%",
                    }}
                  >
                    Submit
                  </Button>
                </div>
              </Paper>
            </Grid>
          </Grid>
        </form>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  currentUser: state.user.currentUser,
  domains: state.domain.domains
});

export default connect(mapStateToProps)(CommentForm);
