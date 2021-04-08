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
    let auth = null;

    const {currentUser} = this.props;
    const {domains} = this.props;
    console.log(currentUser);
    console.log(this.props.currentUser.id);

    // get the nofun token from redux
    // get the host matches the currentUser
    const host_for_currentUser = currentUser.host.split("/")[2];
    domains.map(d=>{
      if(d.domain === host_for_currentUser){
        auth = d.auth;
      }
    });

    const config = {
      headers: {
        // Authorization: auth.split(" ")[1],
        Authorization: auth,
      },
    };

    const doc = await axios.get(currentUser.id + "/inbox/request-list",config);
    console.log(doc);

    //put all request item in state
    console.log("---check--",doc.data.items);
    const requests_list = doc.data.items;
    console.log(requests_list);
    this.setState({requests: requests_list});


    this.state.requests[0].name = "hoee";
    //literate through items and append displayname to each item
    for (let req of requests_list){
      var docc = await axios.get(req.from_user_id,config);
      var request_username = docc.data.displayName;
      req.name = request_username;
    }
    this.setState({request:requests_list});
    console.log(this.state.requests);
  };

  //"from_user_domain" distinguish the domain name no matter what server this "from user" is from
  handleAccept = async (from_user_id,from_user_domain) => {
    let auth = null;
    const {currentUser} = this.props;
    const {domains} = this.props;

    console.log(currentUser);
    console.log(this.props.currentUser.id);
    console.log(from_user_id);
    // get the nofun token from redux
    // get the host matches the currentUser
    const host_for_currentUser = currentUser.host.split("/")[2];
    domains.map(d=>{
      if(d.domain === host_for_currentUser){
        auth = d.auth;
      }
    });

    const config = {
      headers: {
        Authorization: auth.split(" ")[1],
      },
    };
    console.log(auth.split(" ")[1]);

    console.log(from_user_id);
    console.log(currentUser.id);
    const doc = await axios.patch("https://" + from_user_domain + "/friendrequest/accept/", {
      from_user: from_user_id,
      to_user: currentUser.id
    }, config);

    console.log(doc);
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
          {requests.length !== 0 ? (
            requests.map((doc) => (
              <Card>
                <CardActions>
                  <h5>
                    {doc.name } has sent you friend request
                  </h5>
                  <Button
                    size="small"
                    color="primary"
                    variant="contianed"
                    style={{ marginLeft: "10%"}}
                    onClick={() => this.handleAccept(doc.from_user_id,doc.from_user_id.split("/")[2])}
                  >
                    Accept
                  </Button>
                  <Button
                    size="small"
                    color="secondary"
                    variant="contianed"
                    onClick={() => this.handleReject(doc.from_user_id)}
                  >
                    Reject
                  </Button>
                </CardActions>
              </Card>
            ))
          ) : (
            <h7>You have not had any friend requests yet!</h7>
          )}
          <TabPanel value={this.state.value} index={0}>
            comments
          </TabPanel>
          <TabPanel value={this.state.value} index={1}>
            likes
          </TabPanel>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  currentUser: state.user.currentUser,
  domains: state.domain.domains
});

export default connect(mapStateToProps)(Inbox);
