import React from "react";
// redux
import { connect } from "react-redux";
import Header from "../components/Header";
import "./style/common.css";
import PostsScroll from "../components/PostsScroll";
import { Grid, List, Paper, TextField } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import axios from "axios";

class Followers extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      items: [],
      currCategory: ""
    }
  }

  componentDidMount = async () => {
    // extract user
    const { currentUser } = this.props;
    const id = currentUser.id;

    // const doc = await axios.get(`https://nofun.herokuapp.com/author/${id}/followers/`);
    // if (doc.data) {
    //   this.setState({items: doc.data.items});
    // }
  };

  render() {
    const { items, currCategory }  = this.state;
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
              <PostsScroll currCategory={currCategory}/>
            </Grid>
            <Grid item xs={10} sm={4}>
              <h5>Search Posts by Category</h5>
              <TextField
                value={currCategory}
                onChange={(e) => this.setState({currCategory: e.target.value})}
                style={{
                  marginLeft: "3%",
                  marginRight: "3%",
                  marginTop: "3%",
                  width: "100px",
                }}
                id="category"
                label="category"
                variant="filled"
              />
              <br /><br />
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

