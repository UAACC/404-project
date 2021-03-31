import React from "react";
import "./style/common.css";
import {
  CardActions,
  CardContent,
  Card,
  Typography,
  Button,
} from "@material-ui/core";
import axios from "axios";
import { connect } from "react-redux";
import Cookies from "js-cookie";
import Header from "../components/Header";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Box from "@material-ui/core/Box";

class FriendsRequest extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      requests: [],
    };
  }

  componentDidMount = async () => {
    const doc = await axios.get("https://nofun.herokuapp.com/friendrequest/");
    const { currentUser } = this.props;
    const api_requests = [];
    for (let request of doc.data) {
      if (request.status === "R" && request.to_user === currentUser.id) {
        api_requests.push(
          axios.get(
            "https://nofun.herokuapp.com/author/" + request.from_user + "/"
          )
        );
      }
    }
    const requests = await Promise.all(api_requests);
    this.setState({ requests });
  };

  handleAccept = async (from_user) => {
    const { id } = this.props.currentUser;
    const csrftoken = Cookies.get("csrftoken");
    const config = {
      headers: {
        "X-CSRFToken": csrftoken,
        "Content-Type": "application/json",
      },
    };
    const doc = await axios.patch(
      "https://nofun.herokuapp.com/friendrequest/accept/",
      { from_user, to_user: id },
      config
    );
    if (doc.data) {
      await window.alert(doc.data);
      this.componentDidMount();
    }
  };

  handleReject = async (from_user) => {
    const { id } = this.props.currentUser;
    const csrftoken = Cookies.get("csrftoken");
    const config = {
      headers: {
        "X-CSRFToken": csrftoken,
        "Content-Type": "application/json",
      },
    };
    const doc = await axios.patch(
      "https://nofun.herokuapp.com/friendrequest/decline/",
      { from_user, to_user: id },
      config
    );
    if (doc.data) {
      await window.alert(doc.data);
      this.componentDidMount();
    }
  };

  render() {
    const { requests } = this.state;
    return (
      <div>
        <Header />
        <div
          style={{ marginLeft: "10%", marginRight: "10%", marginTop: "30px" }}
        >
          <Tabs
            indicatorColor="primary"
            orientation="vertical"
            textColor="primary"
            variant="scrollable"
            scrollButtons="auto"
            aria-label="tabs"
          >
            <Tab label="comments" />
            <Tab label="likes❤️" />
            <Tab label="Friend requests" />
          </Tabs>
          {requests.length !== 0 ? (
            requests.map((doc) => (
              <Card>
                <CardContent>
                  <Typography variant="h5" component="h2" gutterBottom>
                    User Name: {doc.data.username}
                  </Typography>
                  <Typography color="textSecondary">
                    Email: {doc.data.email}
                  </Typography>
                  <Typography color="textSecondary">
                    Bio: {doc.data.bio}
                  </Typography>
                  <Typography variant="body2" component="p">
                    Github: {doc.data.github}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    color="primary"
                    variant="contianed"
                    onClick={() => this.handleAccept(doc.data.id)}
                  >
                    Accept
                  </Button>
                  <Button
                    size="small"
                    color="secondary"
                    variant="contianed"
                    onClick={() => this.handleReject(doc.data.id)}
                  >
                    Reject
                  </Button>
                </CardActions>
              </Card>
            ))
          ) : (
            <h7>You have not had any friend requests yet!</h7>
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  currentUser: state.user.currentUser,
});

export default connect(mapStateToProps)(FriendsRequest);
