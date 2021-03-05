import React from "react";
import Posting from "../components/Posting";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import HourglassEmptyIcon from '@material-ui/icons/HourglassEmpty';
import axios from "axios";
import Header from "../components/Header";

class PostDetail extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      post: [],
    };
  }

  componentDidMount = async() =>{
    const doc = await axios.get("/api/posts/" + this.props.match.params.id + "/");
    this.setState({post:doc.data})
  }


  render() {
    const {post} = this.state;
    return (
        <div>
            <Header></Header>
            {post.length !==0 ?
        (
            <Posting post = {post}></Posting>
        ):
        (
          <center>
          <HourglassEmptyIcon fontSize="large" style={{ marginTop: 20 }}></HourglassEmptyIcon>
          <Typography variant="h3" style={{ marginLeft: 20 }}>processing ...</Typography>
          </center>
        )
        }
            
        </div>
        
//         <div>
//             <Header></Header>
// <div style={{ marginLeft: "10%", marginRight: "10%", marginTop: "30px" }}>
    
//     {posts.length !==0 ?
//     (
//       posts.map((post)=>(
//         <Grid item xs={6}>
//           <Paper style={{  overflow: "auto" }}>
//           <Posting post = {post} handleClick = {() => window.location="/posts/"+post.id}></Posting>
//           </Paper> 
//         </Grid>
//       ))
//     ):
//     (
//       <center>
//       <HourglassEmptyIcon fontSize="large" style={{ marginTop: 20 }}></HourglassEmptyIcon>
//       <Typography variant="h3" style={{ marginLeft: 20 }}>processing ...</Typography>
//       </center>
//     )
//     }
//       <Grid item xs={3}>
//     </Grid>
//   </div>
// </div>

      
    );
  }
}

// const mapStateToProps = (state) => ({
//   currentUser: state.user.currentUser,
// });

// export default connect(mapStateToProps)(Header);
export default PostDetail;