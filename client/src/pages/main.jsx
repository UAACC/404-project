import React from "react";
// redux
import { connect } from "react-redux";
import Header from "../components/Header";
import "./style/common.css";
import PostsScroll from "../components/PostsScroll";
import { Grid, List, Paper } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import axios from "axios";

class Followers extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      items: [],
      friends:[]
    }
  }



  componentDidMount = async () => {
    // extract user
    const { currentUser } = this.props;
    const id = currentUser.id;
    const id_digit = id.split("/")[4];
    
    const doc = await axios.get(`https://nofun.herokuapp.com/author/${id_digit}/followers/`);
    if (doc.data) {
      this.setState({items: doc.data.items});
    }

    const frienddoc = await axios.get(`https://nofun.herokuapp.com/author/${id_digit}/friends/`);
    if(doc.data) {
      this.setState({friends: frienddoc.data.items})
    }
  };

  render() {
    const { items,friends }  = this.state;
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
            <Grid item xs={10} sm={8}>
              <PostsScroll />
            </Grid>
            <Grid item xs={10} sm={4}>
              <h5>Followers: {items.length} person(s)</h5>
              {
                items.map(f => {
                  return <Card>
                  <CardContent width={1}>
                    <Typography color="textSecondary">
                      {f.displayName}
                    </Typography>
                  </CardContent>
                </Card>
                })
              }
              <h5>Friends: {items.length} person(s)</h5>
              {
                friends.map(f => {
                  return <Card>
                  <CardContent width={1}>
                    <Typography color="textSecondary">
                      {f.displayName}
                    </Typography>
                  </CardContent>
                </Card>
                })
              }
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
});
export default connect(mapStateToProps)(Followers);

