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
import PropTypes from "prop-types";

import { connect } from "react-redux";
import Cookies from "js-cookie";
import Header from "../components/Header";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Box from "@material-ui/core/Box";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}

class Inbox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      requests: [],
      value: "",
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
        Authorization: "Basic UmVtb3RlMTpyZW1vdGUxMjM0",
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
        Authorization: "Basic UmVtb3RlMTpyZW1vdGUxMjM0",
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

  handleChange = (event, value) => {
    this.setState({ value });
  };

  render() {
    const { requests } = this.state;
    return (
      <div>
        <Header />
        <div
          style={{
            marginLeft: "15%",
            marginRight: "10%",
            marginTop: "30px",
            display: "flex",
          }}
        >
          <Tabs
            value={this.state.value}
            onChange={this.handleChange}
            aria-label="tabs"
            orientation="vertical"
            variant="scrollable"
            style={{
              marginRight: "5%",
            }}
          >
            <Tab label="comments" {...a11yProps(0)} />
            <Tab label="likes" {...a11yProps(1)} />
            <Tab label="Friend requests" {...a11yProps(2)} />
          </Tabs>
          <TabPanel value={this.state.value} index={0}>
            comments
          </TabPanel>
          <TabPanel value={this.state.value} index={1}>
            likes
          </TabPanel>
          <TabPanel value={this.state.value} index={2}>
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
          </TabPanel>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  currentUser: state.user.currentUser,
});

export default connect(mapStateToProps)(Inbox);
