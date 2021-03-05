import React from "react";
import "./style/common.css";
import Header from "../components/Header";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";

import DeleteIcon from "@material-ui/icons/Delete";
import AddIcon from "@material-ui/icons/Add";

import axios from "axios";
import { connect } from "react-redux";

class FriendsRequest extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      requests: [],
    };
  }

  /*
  componentDidMount = async () => {
    const doc = await axios.get("http://127.0.0.1:8000/api/");
    this.setState({ requests: doc.data });
  };
    */
  render() {
    const { requests } = this.state;
    return (
      <div>
        <Header></Header>
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
              <Paper style={{ height: "710px" }}>
                <List>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar>T</Avatar>
                    </ListItemAvatar>
                    <ListItemText primary="test" />
                    <ListItemSecondaryAction>
                      <IconButton edge="end" aria-label="add">
                        <AddIcon />
                      </IconButton>
                      <IconButton edge="end" aria-label="delete">
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                </List>
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
});

export default connect(mapStateToProps)(FriendsRequest);
