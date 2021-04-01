import React from "react";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import { Button } from "@material-ui/core";
import { connect } from "react-redux";
import Cookies from 'js-cookie'
import axios from "axios";


class CommentForm extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      comment: "",
      post: props.post
    }
  }

  handleSubmit = async (event) => {
    event.preventDefault();

    const { token, id } = this.props.currentUser;
    const { comment, post } = this.state;

    const csrftoken = Cookies.get('csrftoken');
    const config = {
      headers: {
        'Authorization': "Basic UmVtb3RlMTpyZW1vdGUxMjM0",
        'X-CSRFToken': csrftoken,
        'Content-Type': 'application/json',
      }
    }
    const doc = await axios.get(post.id + "/comments/", {
       type:"comment", comment, author: id, contentType: "text/plain"
      
      }, config);
    if (doc.data) {
      this.props.handleClick();
    }
  };


  render(){
    const { comment } = this.state;
    return (
        <div
        style={{ marginLeft: "5%", marginRight: "10%", marginTop: "15px" }}
      >
        <form>
            <Grid item xs={10}>
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
        </form>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
    currentUser: state.user.currentUser,
  });
  
  export default connect(mapStateToProps)(CommentForm);