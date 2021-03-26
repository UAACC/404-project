import React from "react";
import Radio from "@material-ui/core/Radio";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import { Button } from "@material-ui/core";
import { connect } from "react-redux";
import Cookies from 'js-cookie'
import axios from "axios";



class CommentForm extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      post: this.props.post.id,
      content: null,
    }
  }

  componentDidMount = async() => {
    console.log("----inside commentform",this.state.post);
    const { comment } = this.state;
    if (comment) {
      const doc = await axios.get('/api/authors/'+this.state.comment.author+'/');
      this.setState({author: doc.data});
    }
  }

  handleSubmit = async (event) => {
    event.preventDefault();
    const { token } = this.props.currentUser;
    const { post,content } = this.state;
    const csrftoken = Cookies.get('csrftoken');
    const config = {
      headers: {
        "Authorization": `Token ${token}`,
        'X-CSRFToken': csrftoken,
        'Content-Type': 'application/json',
      }
    }
    const doc = await axios.post("/api/comments/", { post,content }, config);
    if (doc.data) {
      this.props.handleClick();
    }
  };


  render(){
    const { author, comment } = this.state;
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
                      this.setState({ content: e.target.value });
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