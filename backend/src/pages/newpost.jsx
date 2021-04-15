import React from "react";
import "./style/common.css";
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

class Newpost extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      autherID: "",
      title: "",
      description: "",
      category: "",
      published: "",
      format: "",
      image: "",
      visibility: "",
    };
  }

  checkValidation = () => {
    const {  title, description, visibility } = this.state;
    if (!title || !description || !visibility) {
      return false;
    }
    return true;
  }

  handleSubmit = async (event) => {
    event.preventDefault();
    if (!this.checkValidation()) {
      return window.alert('You have not filed the form completely.')
    }

    const { token } = this.props.currentUser;
    const { title, description, visibility } = this.state;
    const csrftoken = Cookies.get('csrftoken');
    const config = {
      headers: {
        "Authorization": `Token ${token}`,
        'X-CSRFToken': csrftoken,
        'Content-Type': 'application/json',
      }
    }
    const doc = await axios.post("https://nofun.herokuapp.com/posts/", { title, description, visibility }, config);
    if (doc.data) {
      window.location = `/posts/${doc.data}/`
    }
  };

  render() {
    return (
      <div>
        <div
          style={{ marginLeft: "10%", marginRight: "10%", marginTop: "30px" }}
        >
          <form>
            <Grid
              container
              spacing={4}
              direction="horizenol"
              justify="center"
              alignItems="flex-start"
            >
              <Grid item xs={10}>
                <Paper style={{ height: "710px" }}>
                  <div id="title">
                    <TextField
                      onChange={(e) => {
                        this.setState({ title: e.target.value });
                      }}
                      id="title"
                      name="title"
                      style={{
                        marginLeft: "3%",
                        marginRight: "3%",
                        marginTop: "3%",
                        width: "94%",
                      }}
                      label="Post title"
                      multiline
                      rows={1}
                      variant="outlined"
                    />
                  </div>
                  <div id="format">
                    <FormControl
                      component="fieldset"
                      style={{
                        marginLeft: "3%",
                        marginRight: "3%",
                        marginTop: "3%",
                        width: "94%",
                      }}
                      onChange={(e) => {
                        this.setState({ format: e.target.value });
                      }}
                    >
                      <FormLabel component="legend">How do you want to format the content?</FormLabel>
                      <RadioGroup row aria-label="visible" name="visible">
                        <FormControlLabel
                          value="plaintext"
                          control={<Radio />}
                          label="Plain Text"
                        />
                        <FormControlLabel
                          value="markdown"
                          control={<Radio />}
                          label="Markdown"
                        />
                      </RadioGroup>
                    </FormControl>
                  </div>
                  <div id="content">
                    <TextField
                      onChange={(e) => {
                        this.setState({ description: e.target.value });
                      }}
                      id="description"
                      name="description"
                      style={{
                        marginLeft: "3%",
                        marginRight: "3%",
                        marginTop: "3%",
                        width: "94%",
                      }}
                      label="Post Content"
                      multiline
                      rows={6}
                      variant="outlined"
                    />
                  </div>
                  <div id="category">
                    <TextField
                      onChange={(e) => {
                        this.setState({ category: e.target.value });
                      }}
                      style={{
                        marginLeft: "3%",
                        marginRight: "3%",
                        marginTop: "3%",
                        width: "94%",
                      }}
                      id="category"
                      label="category"
                      variant="filled"
                    />
                  </div>
                  <div id="image">  
                    <Button
                      onClick={() => {
                        this.setState({ PopupImageUpload: true });
                      }}
                      variant="outlined"
                      color="primary"
                      style={{
                        marginLeft: "3%",
                        marginTop: "3%",
                      }}
                    >
                      Upload Image
                    </Button>
                  </div>
                  <div id="visibility">
                    <FormControl
                      component="fieldset"
                      style={{
                        marginLeft: "3%",
                        marginRight: "3%",
                        marginTop: "3%",
                        width: "94%",
                      }}
                      onChange={(e) => {
                        this.setState({ visibility: e.target.value });
                      }}
                    >
                      <FormLabel component="legend">Who can see this post?</FormLabel>
                      <RadioGroup row aria-label="visible" name="visible">
                        <FormControlLabel
                          value="public"
                          control={<Radio />}
                          label="Public"
                        />
                        <FormControlLabel
                          value="friends"
                          control={<Radio />}
                          label="Only for friends"
                        />
                        <FormControlLabel
                          value="private"
                          control={<Radio />}
                          label="Private"
                        />
                      </RadioGroup>
                    </FormControl>
                  </div>
                  <div id="button">
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
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  currentUser: state.user.currentUser,
});

export default connect(mapStateToProps)(Newpost);
