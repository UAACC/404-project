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
import Chip from "@material-ui/core/Chip";
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
      currCategory: "",
      categories: [],
      published: "",
      format: "",
      imageLocal: true,
      visibility: "PUBLIC",
      unlisted: false,
      specificPeople: [],
      currPeople: "",
    };
  }

  checkValidation = () => {
    const { title, content, description, visibility } = this.state;
    if (
      title === null ||
      content === null ||
      description === null ||
      visibility === null
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
    const {
      title,
      description,
      content,
      contentType,
      visibility,
      specificPeople,
      unlisted,
      categories,
    } = this.state;

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
        count: 1,
        size: 1,
        description,
        content,
        visibility:
          visibility === "SPECIFIC"
            ? JSON.stringify(specificPeople)
            : visibility,
        unlisted,
        contentType,
        published: new Date(),
        author: currentUser?.id,
        categories: JSON.stringify(categories),
      },
      config
    );

    if (doc.data?.id) {
      window.location = `/posts/nofun.herokuapp.com/${
        currentUser?.id.split("/")[4]
      }/${doc.data.id.split("/")[6]}/`;
    }
  };

  render() {
    const {
      title,
      description,
      content,
      contentType,
      specificPeople,
      currPeople,
      visibility,
      imageLocal,
      currCategory,
      categories,
    } = this.state;
    return (
      <div>
        <Header />
        <div
          style={{ marginLeft: "10%", marginRight: "10%", marginTop: "30px" }}
        >
          <Grid
            container
            spacing={4}
            direction="horizenol"
            justify="center"
            alignItems="flex-start"
          >
            <Grid item xs={10}>
              <Paper style={{ height: "90%" }}>
                {contentType !== "image" ? (
                  <div>
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
                            label="Text or MarkDown"
                          />
                          <FormControlLabel
                            value="text/image"
                            checked={contentType === "text/image"}
                            control={<Radio />}
                            label="Text with Image"
                          />
                          <FormControlLabel
                            value="image"
                            checked={contentType === "image"}
                            control={<Radio />}
                            label="Pure Image"
                          />
                        </RadioGroup>
                      </FormControl>
                    </div>
                    <div id="desc">
                      {contentType.includes("image") && (
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
                        />
                      )}
                    </div>
                    {contentType.includes("image") ? (
                      <div id="image">
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
                        </div>
                        {imageLocal ? (
                          <div>
                            <FormLabel
                              style={{
                                marginLeft: "3%",
                                marginTop: "3%",
                                marginRight: "2%",
                              }}
                            >
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
                                marginLeft: "3%",
                                marginTop: "3%",
                                marginRight: "2%",
                              }}
                            >
                              Input image URL
                            </FormLabel>
                            <TextField
                              style={{ width: "80%" }}
                              label="Image"
                              onChange={(e) =>
                                this.setState({ content: e.target.value })
                              }
                            />
                          </div>
                        )}
                        {content && (
                          <img
                            src={content}
                            style={{
                              width: "40%",
                              marginLeft: "3%",
                              marginTop: "3%",
                              marginRight: "2%",
                            }}
                          />
                        )}
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
                    <div id="category">
                      <div style={{ marginLeft: "3%", marginTop: "15px" }}>
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
                            checked={visibility === "PUBLIC"}
                            control={<Radio />}
                            label="Public"
                          />
                          <FormControlLabel
                            value="FRIENDS"
                            control={<Radio />}
                            label="Only for friends"
                          />
                          <FormControlLabel
                            value="UNLISTED"
                            control={<Radio />}
                            label="Do not list"
                          />
                          <FormControlLabel
                            value={"SPECIFIC"}
                            control={<Radio />}
                            label="Only for specific people"
                          />
                        </RadioGroup>
                      </FormControl>
                    </div>
                    {visibility === "SPECIFIC" && (
                      <div id="specificPeople">
                        <div
                          style={{
                            marginLeft: "3%",
                            marginTop: "15px",
                            marginBottom: "3%",
                          }}
                        >
                          {specificPeople.length !== 0 &&
                            specificPeople.map((cate, index) => (
                              <Chip
                                style={{ margin: "3px" }}
                                label={cate}
                                onDelete={() => {
                                  specificPeople.splice(index, 1);
                                  this.setState({ specificPeople });
                                }}
                                color="primary"
                              />
                            ))}
                        </div>
                        <TextField
                          onKeyDown={(key) => {
                            if (key.keyCode === 13) {
                              specificPeople.push(currPeople);
                              this.setState({ specificPeople, currPeople: "" });
                            }
                          }}
                          value={currPeople}
                          onChange={(e) =>
                            this.setState({ currPeople: e.target.value })
                          }
                          style={{
                            marginLeft: "3%",
                            marginRight: "3%",
                            width: "20%",
                          }}
                          id="Specific People"
                          label="Specific People"
                          variant="filled"
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
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
                            label="Text or MarkDown"
                          />
                          <FormControlLabel
                            value="text/image"
                            checked={contentType === "text/image"}
                            control={<Radio />}
                            label="Text with Image"
                          />
                          <FormControlLabel
                            value="image"
                            checked={contentType === "image"}
                            control={<Radio />}
                            label="Pure Image"
                          />
                        </RadioGroup>
                      </FormControl>
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
                    </div>
                    {imageLocal ? (
                      <div>
                        <FormLabel
                          style={{
                            marginLeft: "3%",
                            marginTop: "3%",
                            marginRight: "2%",
                          }}
                        >
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
                            marginLeft: "3%",
                            marginTop: "3%",
                            marginRight: "2%",
                          }}
                        >
                          Input image URL
                        </FormLabel>
                        <TextField
                          style={{ width: "70%" }}
                          label="Image"
                          onChange={(e) =>
                            this.setState({ content: e.target.value })
                          }
                        />
                      </div>
                    )}
                    {content && (
                      <img
                        src={content}
                        style={{
                          width: "40%",
                          marginLeft: "3%",
                          marginTop: "3%",
                          marginRight: "2%",
                        }}
                      />
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
                            checked={visibility === "PUBLIC"}
                            control={<Radio />}
                            label="Public"
                          />
                          <FormControlLabel
                            value="FRIENDS"
                            control={<Radio />}
                            label="Only for friends"
                          />
                          <FormControlLabel
                            value="UNLISTED"
                            control={<Radio />}
                            label="Do not list"
                          />
                          <FormControlLabel
                            value={"SPECIFIC"}
                            control={<Radio />}
                            label="Only for specific people"
                          />
                        </RadioGroup>
                      </FormControl>
                    </div>
                  </div>
                )}
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
