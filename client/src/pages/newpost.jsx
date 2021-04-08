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
import axios from "axios";
import Header from "../components/Header";

class Newpost extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      type: "post",
      auther: "",
      title: "",
      source: "",
      origin: "",
      description: "",
      content: "",
      contentType: "text/plain",
      category: [],
      published: "",
      format: "",
      imageLocal: true,
      visibility: "PUBLIC",
      unlisted: false
    };
  }

  checkValidation = () => {
    const { title, content, description, visibility, unlisted } = this.state;
    if (
      title === null ||
      content === null ||
      description === null ||
      visibility === null ||
      unlisted === null
    ) {
      return false;
    }
    return true;
  };

  encodeFileBase64 = (file) => {
    var reader = new FileReader();
    if (file) {
      reader.readAsDataURL(file);
      reader.onload = () => {
        var Base64 = reader.result;
        // console.log(Base64);
        this.setState({ content: Base64 });
      };
      reader.onerror = (error) => {
        console.log("error: ", error);
      };
    }
  };

  handleSubmit = async (event) => {
    event.preventDefault();
    if (!this.checkValidation()) {
      return window.alert("You have not filed the form completely.");
    }
    const { domains, currentUser } = this.props;
    const { title, description, content, contentType, visibility, unlisted } = this.state;

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
          title,
          source: "",
          origin: "",
          categorie: "web",
          count: 1,
          size: 1,
          description,
          content,
          visibility,
          unlisted,
          contentType,
          published: new Date(),
          author: currentUser?.id,
          unlisted: false,
        },
        config
      );
    
    if (doc.data?.id) {
      window.location = `/posts/nofun.herokuapp.com/${currentUser?.id.split("/")[4]}/${doc.data.id.split("/")[6]}/`;
    }
  };

  render() {
    const { title, description, content, contentType, unlisted, visibility, imageLocal } = this.state;
    return (
      <div>
        <Header />
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
                <Paper style={{ height: "90%" }}>
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
                      label="Title"
                      multiline
                      rows={1}
                      value={title}
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
                        this.setState({ contentType: e.target.value });
                      }}
                    >
                      <FormLabel component="legend">
                        What content do you want to post?
                      </FormLabel>
                      <RadioGroup row aria-label="visible" name="visible">
                        <FormControlLabel
                          value="text/plain"
                          checked={contentType === "text/plain"}
                          control={<Radio />}
                          label="Plain Text"
                        />
                        <FormControlLabel
                          value="image"
                          control={<Radio />}
                          label="Image"
                        />
                      </RadioGroup>
                    </FormControl>
                  </div>
                  <div id="desc">
                    {
                      contentType === "image" && 
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
                        label="Description"
                        value={description}
                        multiline
                        rows={2}
                        variant="outlined"
                      />}
                  </div>
                  {/* <div id="category">
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
                  </div> */}
                  {contentType === "image" ?
                    (<div id="image" style={{marginLeft: "3%", marginTop: "2%"}}>
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
                            this.setState({ imageLocal: e.target.value === "true" });
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
                      </div>
                      {imageLocal ?
                        <div>
                          <FormLabel style={{marginRight: "20px"}}>
                            Upload an Image from local machine
                          </FormLabel>
                          <input type="file" onChange={(e) => this.encodeFileBase64(e.target.files[0])} />
                        </div>
                        :
                        <div>
                          <FormLabel style={{marginTop: "30px", marginRight: "20px"}}>Input image URL</FormLabel>
                          <TextField style={{width: "80%"}} label="Image" onChange={(e) => this.setState({content: e.target.value})}/>
                        </div>
                      }
                      {content && <img src={content} style={{width: "40%"}} />}
                    </div>
                  ) : (
                    <div id="content">
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
                        label="Content"
                        value={content}
                        multiline
                        rows={6}
                        variant="outlined"
                      />
                    </div>
                  )}

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
                      <FormLabel component="legend">
                        Who can see this post?
                      </FormLabel>
                      <RadioGroup row aria-label="visible" name="visible">
                        <FormControlLabel
                          value="PUBLIC"
                          checked={visibility === 'PUBLIC'}
                          control={<Radio />}
                          label="Public"
                        />
                        <FormControlLabel
                          value="FRIENDS"
                          control={<Radio />}
                          label="Only for friends"
                        />
                      </RadioGroup>
                    </FormControl>
                  </div>
                  <div id="unlisted">
                    <FormControl
                      component="fieldset"
                      style={{
                        marginLeft: "3%",
                        marginRight: "3%",
                        marginTop: "3%",
                        width: "94%",
                      }}
                      onChange={(e) => {
                        if (e.target.value === "false") {
                          this.setState({ unlisted: false });
                        } else {
                          this.setState({ unlisted: true });
                        }
                      }}
                    >
                      <FormLabel component="legend">
                        Do you want to list this post?
                      </FormLabel>
                      <RadioGroup row aria-label="unlisted" name="unlisted">
                        <FormControlLabel
                          value="false"
                          checked={!unlisted}
                          control={<Radio />}
                          label="Yes"
                        />
                        <FormControlLabel
                          value="true"
                          control={<Radio />}
                          label="No"
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
                        marginBottom: "3%",
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
  domains: state.domain.domains,
});

export default connect(mapStateToProps)(Newpost);
