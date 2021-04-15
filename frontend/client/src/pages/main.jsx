import React from "react";
import { connect } from "react-redux";
import Header from "../components/Header";
import "./style/common.css";
import PostsScroll from "../components/PostsScroll";
import { Grid, TextField } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import axios from "axios";


class MainPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      followers: [],
      currCategory: "",
      friends: [],
    };
  }

  componentDidMount = async () => {
    // extract user
    const { currentUser, domains } = this.props;
    const id = currentUser.id;

    const id_digit = id.split("/")[4];

    const followerDoc = await axios.get(
      `https://nofun.herokuapp.com/author/${id_digit}/followers/`
    );
    let followers = followerDoc.data?.items;
    const FApis1 = followers.map((follower) => {
      let auth = null;
      const domain = follower.split("/")[2];
      domains.map((d) => {
        if (d.domain === domain) {
          auth = d.auth;
        }
      });
      const config = {
        headers: {
          Authorization: auth,
        },
      };
      return axios.get(follower, config);
    });

    let res = await Promise.all(FApis1);
    res = res.map((d) => d.data);
    console.log(res);

    this.setState({ followers: res });

    // friends list
    const friendDoc = await axios.get(
      `https://nofun.herokuapp.com/author/${id_digit}/friends/`
    );
    let friends = friendDoc.data?.items;
    const FApis2 = friends.map((friend) => {
      let auth = null;
      const domain = friend.split("/")[2];
      domains.map((d) => {
        if (d.domain === domain) {
          auth = d.auth;
        }
      });
      const config = {
        headers: {
          Authorization: auth,
        },
      };
      return axios.get(friend, config);
    });

    res = await Promise.all(FApis2);
    res = res.map((d) => d.data);
    console.log(res);

    this.setState({ friends: res });
  };

  render() {
    const { followers, friends, currCategory } = this.state;
    return (
      <div style={{ 
        backgroundImage: `url("https://images.pexels.com/photos/747964/pexels-photo-747964.jpeg")`, 
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: window.innerHeight,
      }}>
        <Header />
        <div
          style={{ marginLeft: "14%", marginRight: "5%", marginTop: "30px" }}
        >
          <Grid
            container
            spacing={4}
            direction="horizenol"
            justify="center"
            alignItems="flex-start"
          >
            <Grid item xs={10} sm={7}>
              <PostsScroll currCategory={currCategory} />
            </Grid>
            <Grid item xs={10} sm={4}>
              <h6 style={{fontFamily: "monospace", fontSize: 20, color: "white"}}>Search Posts by Category</h6>
              <TextField
                value={currCategory}
                onChange={(e) =>
                  this.setState({ currCategory: e.target.value })
                }
                style={{
                  marginRight: "3%",
                  marginTop: "3%",
                  width: "200px",
                }}
                id="category"
                label="category"
                variant="filled"
              />
              <br />
              <br />
              <div id="followerDiv" style={{height: window.innerHeight * 0.3, overflow: "hidden", overflowY: "scroll", fontFamily: "monospace", fontSize: 20, color: "white" }}>
                <h7>Followers: {followers.length} person(s)</h7>
                {followers.map((f) => {
                  return (
                    <Card
                      style={{ width: "300px" }}
                      onClick={() =>
                        (window.location =
                          "/authors/" +
                          f.id.split("/")[2] +
                          "/" +
                          f.id.split("/")[4])
                      }
                    >
                      <CardContent width={1}>
                        <Typography color="textSecondary">
                          {f.displayName}
                        </Typography>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
              <br />
              <div id="friendDiv" style={{height: window.innerHeight * 0.3, overflow: "hidden", overflowY: "scroll", fontFamily: "monospace", fontSize: 20, color: "white" }}>
              <h7>Friends: {friends.length} person(s)</h7>
                {friends.map((f) => {
                  return (
                    <Card
                      style={{ width: "300px" }}
                      onClick={() =>
                        (window.location =
                          "/authors/" +
                          f.id.split("/")[2] +
                          "/" +
                          f.id.split("/")[4])
                      }
                    >
                      <CardContent width={1}>
                        <Typography color="textSecondary" >
                          {f.displayName}
                        </Typography>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </Grid>
          </Grid>
        </div>
      </div>
    );
  }
}

// redux
const mapStateToProps = (state) => ({
  currentUser: state.user.currentUser,
  domains: state.domain.domains,
});

export default connect(mapStateToProps)(MainPage);
