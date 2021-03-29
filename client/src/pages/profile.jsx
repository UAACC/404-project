import React from "react";
import { connect } from "react-redux";
import "./style/common.css";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import ProfileComponent from "../components/ProfileComponent";
import PostsScroll from "../components/UserPostsScroll";
import axios from "axios";

class ProfilePage extends React.Component {
  constructor(props){
    super(props);
    this.state = {id: null, user: null}
  }

  componentDidMount = async () => {
    let doc = null;
    try {
      doc = await axios.get("https://nofun.herokuapp.com/author/"+this.props.match.params.id+"/");
    } catch {
      doc = await axios.get("https://c404-w2021-t1-social-distribut.herokuapp.com/author/"+this.props.match.params.id+"/");
    }
    this.setState({ user: doc.data });
  }

  render() {
    const { user } = this.state;
    return (
      <div style={{ marginLeft: "10%", marginRight: "10%", marginTop: "30px" }}>
        {user ? 
        <Grid
          container
          spacing={4}
          direction="horizenol"
          justify="center"
          alignItems="flex-start"
        >
            <Grid item xs={6} sm={6}>
              <Paper style={{ height: "710px", overflow: "auto" }}>
                <PostsScroll user={user}/>
              </Paper>
            </Grid>
            <Grid item xs={6} sm={6}>
              <Paper>
                <ProfileComponent user={user} />      
              </Paper>
            </Grid> </Grid>
          : null}
       
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  currentUser: state.user.currentUser,
});

export default connect(mapStateToProps)(ProfilePage);
