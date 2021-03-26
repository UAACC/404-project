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
import { Container, TextField } from "@material-ui/core";
import EditIcon from '@material-ui/icons/Edit';
import { connect } from "react-redux";

axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = 'X-CSRFToken'


class PostDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      post: [],
      authorName: null,
      comments:[],
      authorsList: [],
      title: "",
      description: "",
      commentOpen: false,
      editOpen: false
    };
  }

  componentDidMount = async () => {
    //set post's information in state
    const doc = await axios.get(
      "/api/posts/" + this.props.match.params.id + "/"
    );
    this.setState({ post: doc.data, title: doc.data.title, description: doc.data.description });
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
      <Container style={{marginLeft: "10%"}}>
        {
          comments.length !== 0 ? (
          comments.map((comment) => (
            <CommentCard 
              comment={comment}
              handleClick={this.componentDidMount}
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

    var post = post.id;
    await axios.post("/api/likes/", { post });
    this.componentDidMount();
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

  handleEdit = () => {
    const { post } = this.state;
    const { id } = this.props.currentUser;
    if (id === post.author) {
      this.setState({editOpen: !this.state.editOpen});
    }
  }

  handleSubmitEdit = async () => {
    const { post, title, description } = this.state;

    await axios.patch("/api/posts/" + post.id + "/", { title, description });
    this.componentDidMount();
  }

  handleDelete = async () => {
    const { post } = this.state;

    await axios.delete("/api/posts/" + post.id + "/");
    window.location = "/posts/";
  }

  render() {
    const { post, title, description, editOpen, commentOpen } = this.state;
    const { currentUser } = this.props;
    return (
      <div>
        {post.length !== 0 ? (

          <Paper style={{ overflow: "auto", marginLeft: "10%", marginRight: "10%", marginTop: "5%" }}>
            <div style = {{marginLeft:"20%", marginTop: "5%"}}>
              {
                editOpen ? 
                <TextField label="Titile" value={title} onChange={(e) => this.setState({title: e.target.value}) }/>
                :
                <Typography variant="h3">{post.title}</Typography>
              }
            <img src = "http://www.xinhuanet.com/ent/2018-11/29/1123782546_15434527871911n.jpg"></img>
            <Typography>
                  <DescriptionIcon fontSize="medium" style = {{marginRight:"2%"}}></DescriptionIcon>
                  {this.state.authorName}
              </Typography>
              {
                editOpen ? 
                <TextField label="Description" value={description} onChange={(e) => this.setState({description: e.target.value}) }/>
                :
                <Typography>
                  <EventNoteIcon fontSize="medium" style = {{marginRight:"2%"}}></EventNoteIcon>
                  {post.description}
                </Typography>
              }
              <Typography>
                  <AccountBoxIcon fontSize="medium" style = {{marginRight:"2%"}}></AccountBoxIcon>
                  {post.published.split("T")[0]}
              </Typography>
            </div>
            <br /><br />
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
              <IconButton style = {{marginLeft:"10%"}} onClick = {this.handleLike}>
                {this.renderLike()}
                <div>{post.likes.length}</div>
              </IconButton>
              <ShareIcon style = {{marginLeft:"10%"}}></ShareIcon>
              <IconButton style = {{marginLeft:"10%"}} onClick={() => this.setState({commentOpen: !this.state.commentOpen})}>
                <CommentIcon></CommentIcon>
              </IconButton>
              {
                currentUser && currentUser.id === post.author ? 
                editOpen ? 
                <IconButton style = {{marginLeft:"10%", color: "green"}} onClick={this.handleSubmitEdit}>
                  V
                </IconButton>
                :
                <IconButton style = {{marginLeft:"10%"}} onClick={this.handleEdit}>
                  {this.renderEdit()}
                </IconButton> : null
              }
              {
                currentUser && currentUser.id === post.author ? 
                  <IconButton style = {{marginLeft:"10%", color: "red"}} onClick={this.handleDelete}>
                    X
                  </IconButton> 
                : 
                null
              }
              {
                commentOpen ?
                <div style={{marginLeft: "10%"}}>
                  <CommentForm post={post} handleClick={this.componentDidMount} />
                </div>
                : null
              }
              {this.getAllComments()}    
              <br />< br/>      
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

