import React from "react";
import Posting from "../components/Posting";
import CommentCard from "../components/commentCard";
import CommentForm from "../components/commentForm";
import profileee from "../components/ProfileComponent"
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import HourglassEmptyIcon from "@material-ui/icons/HourglassEmpty";
import axios from "axios";
import Header from "../components/Header";
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import DescriptionIcon from '@material-ui/icons/Description';
import EventNoteIcon from '@material-ui/icons/EventNote';
import ClosedCaptionIcon from '@material-ui/icons/ClosedCaption';
import ShareIcon from "@material-ui/icons/Share";
import FavoriteIcon from "@material-ui/icons/Favorite";
import CommentIcon from "@material-ui/icons/Comment";
import PermIdentityIcon from '@material-ui/icons/PermIdentity';
import IconButton from '@material-ui/core/IconButton';
import ChatIcon from '@material-ui/icons/Chat';
import { Container } from "@material-ui/core";
import EditIcon from '@material-ui/icons/Edit';

import { connect } from "react-redux";
import Cookies from 'js-cookie'

class PostDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      post: [],
      authorName: null,
      comments:[],
      authorsList: [],
    };
  }

  componentDidMount = async () => {
    //set post's information in state
    const doc = await axios.get(
      "/api/posts/" + this.props.match.params.id + "/"
    );
    this.setState({ post: doc.data });
    //match user's id with the postid to fetch author's username
    const authorDoc = await axios.get("/api/authors/");
    const authorList = authorDoc.data;
    const the_author_matched = authorList.filter((singleAuthor) => singleAuthor.id == doc.data.author);
    this.setState({authorName: the_author_matched[0].username});
  };

  getAllComments = () => {
    const {post} = this.state;
    var {comments} = this.state;
    console.log(this.props.currentUser);
    comments = post.comments;
    // this.setState({comments:comments});
    console.log(comments);
    return (
      <Container>
        {
          comments.length !== 0 ? (
          comments.map((comment) => (
            <CommentCard 
              comment = {comment}
            />
          ))
          )
          :(<div>there's no comment yet</div>)
        }
      </Container>
    );
  }

  handleLike = async () => {
    var {post} = this.state;
    const { token } = this.props.currentUser;
    const csrftoken = Cookies.get('csrftoken');
    const config = {
      headers: {
        "Authorization": `Token ${token}`,
        'X-CSRFToken': csrftoken,
        'Content-Type': 'application/json'
      }
    }
    var post = post.id;
    const doc = await axios.post("/api/likes/", { post }, config);
    window.location = "/posts/" + post;
  }

  renderLike = () => {
    const {post} = this.state;
    const user = this.props.currentUser;
    const likesToPost = post.likes;
    //看当前user有没有喜欢这个post
    const currentLike = likesToPost.filter((like)=>like.author === user.id);
    if (currentLike.length !=0){
      return (<FavoriteIcon color = "secondary" size = "large"/>);
    }
    else{
      return (<FavoriteIcon/>);
    }
  }

  renderEdit = () => {
    const {post} = this.state;
    const user = this.props.currentUser;
    const likesToPost = post.likes;
    //看当前user有没有喜欢这个post
    const currentLike = likesToPost.filter((like)=>like.author === user.id);
    if (currentLike.length !=0){
      return (<EditIcon size = "large"/>);
    }
    else{
      return (<EditIcon/>);
    }
  }

  // this.state = {
  //   post: [],
  //   authorName: null,
  //   comments:[],
  //   authorsList: [],
  // };

  handleEdit = async() => {
    var {post} = this.state;
    const {id} = this.props.currentUser;
    if(id === post.author){
      const { token } = this.props.currentUser;
      const csrftoken = Cookies.get('csrftoken');
      const config = {
      headers: {
        "Authorization": `Token ${token}`,
        'X-CSRFToken': csrftoken,
        'Content-Type': 'application/json'
      }
    }
    var postid = post.id;
    const doc = await axios.post("/api/posts/"+postid+"/edit", { title:post.title,description:post.content,publicity:true,image:null,category:null }, config);
    window.location = "/posts/edit/" + postid;
    }

  }

  render() {
    const { post } = this.state;
    return (
      <div>
        <Header></Header>
        {post.length !== 0 ? (

          <Paper style={{ overflow: "auto" }}>
            {/* <center> */}
            <div style = {{marginLeft:"40%"}}>

            <Typography variant="h3">POST DETAIL of</Typography>
            <Typography variant="h5">{post.title}</Typography>
            <img src = "http://www.xinhuanet.com/ent/2018-11/29/1123782546_15434527871911n.jpg"></img>
            <Typography>
                  <PermIdentityIcon fontSize="medium" style = {{marginRight:"2%"}}></PermIdentityIcon>
                  {post.author}
              </Typography>
            <Typography>
                  <DescriptionIcon fontSize="medium" style = {{marginRight:"2%"}}></DescriptionIcon>
                  {post.description}
              </Typography>
            <Typography>
                  <EventNoteIcon fontSize="medium" style = {{marginRight:"2%"}}></EventNoteIcon>
                  {post.published}
              </Typography>
              <Typography>
                  <AccountBoxIcon fontSize="medium" style = {{marginRight:"2%"}}></AccountBoxIcon>
                  {this.state.authorName}
              </Typography>
                 
              {/* <Typography>
                  <ArrowUpwardIcon fontSize="medium" style = {{marginRight:"2%"}}></ArrowUpwardIcon>
                  click to check his/her profile
                  handleClick={() => (window.location = "/profile/" + user.id)}
              </Typography> */}
            </div>
          </Paper>
        ) : (
          <center> 
            <HourglassEmptyIcon
              fontSize="large"
              style={{ marginTop: 20 }}
            ></HourglassEmptyIcon>
            <Typography variant="h3" style={{ marginLeft: 20 }}>
              processing ...
            </Typography>
          </center>
        )}
        {
          post.length !== 0 ? (
            <div style = {{marginTop:"20px"}}>
                <IconButton style = {{marginRight:"15%",marginLeft:"10%"}} onClick = {this.handleLike}>
                  {this.renderLike()}
                  <div>{post.likes.length}</div>
                </IconButton>
                <ShareIcon style = {{marginRight:"15%"}}></ShareIcon>
                <CommentIcon style = {{marginRight:"15%"}}></CommentIcon>
                <IconButton style = {{marginRight:"15%"}} onClick = {this.handleEdit}>
                  {this.renderEdit()}
                </IconButton>
                  <CommentForm post={post}></CommentForm>
                  {this.getAllComments()}          
        </div>
          ):
          <div>rendering</div>
        }                  
      </div>

    );
  }
}


const mapStateToProps = (state) => ({
  currentUser: state.user.currentUser,
});

export default connect(mapStateToProps)(PostDetail);

