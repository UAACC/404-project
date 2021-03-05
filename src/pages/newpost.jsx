import React from "react";
import "./style/common.css";
import Header from "../components/Header";
import Radio from "@material-ui/core/Radio";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import { Button } from "@material-ui/core";
import ChipInput from "material-ui-chip-input";
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
      status: "",
    };
  }

  handleSubmit = async (event) => {
    event.preventDefault();
    const { token } = this.props.currentUser;
    const { title, description } = this.state;
    const csrftoken = Cookies.get('csrftoken');
    const config = {
      headers: {
        "Authorization": `Token ${token}`,
        'X-CSRFToken': csrftoken,
        "Content-type": "application/json",
      }
    }
    const doc = await axios.post("/api/posts/create/", {title, description}, config);
    if (doc.data) {
      window.location = `/posts/${doc.data.id}/`
    }
  };

  render() {
    return (
      <div>
        <Header></Header>
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
                  ></TextField>
                  <div>
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
                    ></TextField>
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

                    {/*
                  <ChipInput
                    style={{
                      marginLeft: "3%",
                      marginRight: "3%",
                      marginTop: "3%",
                      width: "94%",
                    }}
                    defaultValue={["foo", "bar"]}
                    onChange={(chips) => this.handleChange(chips)}
                  />
                 
                  <FormControl
                    component="fieldset"
                    style={{
                      marginLeft: "3%",
                      marginRight: "3%",
                      marginTop: "3%",
                      width: "94%",
                    }}
                  >
                   
                    <FormLabel component="legend">Share with</FormLabel>
                    <RadioGroup
                      row
                      aria-label="visible"
                      name="visible"
                      value={this.state.visibility}
                      onChange={this.handlevisibility}
                    >
                      <FormControlLabel
                        value="public"
                        control={<Radio />}
                        label="public"
                      />
                      <FormControlLabel
                        value="friends"
                        control={<Radio />}
                        label="friends circle"
                      />
                      <FormControlLabel
                        value="specifiedprivate"
                        control={<Radio />}
                        label="private to specified friends"
                      />
                      <FormControlLabel
                        value="specifiedvisible"
                        control={<Radio />}
                        label="visible to specified friends"
                      />
                      <FormControlLabel
                        value="onlyme"
                        control={<Radio />}
                        label="only me"
                      />
                    </RadioGroup>
                  </FormControl>
                  */}
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
                      <FormLabel component="legend">Format</FormLabel>
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
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  currentUser: state.user.currentUser,
});

export default connect(mapStateToProps)(Newpost);
