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
import LabelIcon from '@material-ui/icons/Label';
import { connect } from "react-redux";
import Cookies from 'js-cookie'

class RemotePostDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      post: null,
      targetpost: null,
      displayName: null,
      comments:[],
      authorsList: [],
      title: "",
      description: "",
      commentOpen: false,
      editOpen: false,
      image: null,
    };
  }

  componentDidMount = async() => {
    let posts = [];
    //既然进入了 remote post detail, 那就只能是 team one 的，所以可以 hardcode, 直接呼叫他们的域名
    const requests = this.props.domains?.map(domain => {
      return axios.get("https://" + domain + '/post-list/')
    });
    const resArray = await Promise.all(requests);
    console.log(resArray);
    resArray.map(doc => {
      posts = posts.concat(doc.data);
    });
    const publicPosts = posts.filter(post => post.visibility === "PUBLIC");
    this.setState({ posts: publicPosts });
    console.log(posts[3].id.split("/")[6]);
    //从params里拿到真的post_id
    const real_post_id = this.props.match.params.id;
    //遍历所有的public post，找出match的那一个
    const matched_post = posts.filter(post =>{
      return post.id.split("/")[6] == real_post_id;
    });
    //把match的post存入state
    const targerp = matched_post[0];
    //把真的
    this.setState({post: targerp});
    console.log(this.state.post);
    //呼叫author API找出author的ID
    const fromauthorapi = await axios.get(this.state.post.author);
    const displayName = fromauthorapi.data.displayName;
    console.log(displayName);
    this.setState({displayName});
    this.setState({image:this.state.post.content});
  };

  render() {
    const {  post, title, description, editOpen, commentOpen,image } = this.state;
    const { currentUser } = this.props;
    return (
      <div>
        { post ? (

          <Paper style={{ overflow: "auto", marginLeft: "10%", marginRight: "10%", marginTop: "5%" }}>
            <div style = {{marginLeft:"20%", marginTop: "5%"}}>
              {
                editOpen ? 
                <TextField label="Titile" value={title} onChange={(e) => this.setState({title: e.target.value}) }/>
                :
                <Typography variant="h3">{post.title}</Typography>
              }
            {/* <img src = "https://mentorphiledotcom.files.wordpress.com/2018/09/livedemo-1.png"></img> */}
            <img src = {image}></img>
            <Typography>
                  <DescriptionIcon fontSize="medium" style = {{marginRight:"2%"}}></DescriptionIcon>
                  {this.state.displayName}
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
              <Typography>
                  <LabelIcon fontSize="medium" style = {{marginRight:"2%"}}></LabelIcon>
                  tag: {post.categories[0]}
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
            <Typography variant="h5" style={{ marginLeft: 20 }}>
              The post does not exit OR You do not have the permission to see this post!
            </Typography>
          </center>
        )}
        {
          post ? (
            <div style = {{marginTop:"20px"}}>
              <IconButton style = {{marginLeft:"10%"}} onClick = {this.handleLike}>
                {/* {this.renderLike()} */}
                <div>like API呼叫不了</div>
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
                  {/* {this.renderEdit()} */}
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
              {/* {this.getAllComments()}     */}
              <br />< br/>      
        </div>
          ): null
        }                  
      </div>

    );
  }
}


const mapStateToProps = (state) => ({
  currentUser: state.user.currentUser,
  domains: state.domain.domains
});

export default connect(mapStateToProps)(RemotePostDetail);

