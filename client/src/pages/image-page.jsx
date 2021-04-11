import React from "react";
import CommentCard from "../components/commentCard";
import CommentForm from "../components/commentForm";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import HourglassEmptyIcon from "@material-ui/icons/HourglassEmpty";
import axios from "axios";
import ShareIcon from "@material-ui/icons/Share";
import FavoriteIcon from "@material-ui/icons/Favorite";
import IconButton from "@material-ui/core/IconButton";
import CommentIcon from "@material-ui/icons/Comment";
import { Container, TextField, Avatar } from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import Header from "../components/Header";
import { connect } from "react-redux";


class ImageDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      post: null,
      author: null,
      comments: [],
      authorsList: [],
      title: "",
      content: "",
      description: "",
      commentOpen: false,
      editOpen: false,
      domain: props.match.params.domain,
      authorId: props.match.params.authorId,
      postId: props.match.params.postId,
    };
  }

  componentDidMount = async () => {
    const { currentUser, domains, userFriends } = this.props;
    const { domain, authorId, postId } = this.state;
    let auth = null;
    domains.map(d => {
      if (d.domain === domain) {
        auth = d.auth;
      }
    });

    const config = {
      headers: {
        "Authorization": auth,
      },
    };

    const post_id = "https://" + domain + "/author/" + authorId + "/posts/" + postId + "/";

    const doc = await axios.get(post_id, config);

    let post = null;
    if (doc.data.length === undefined) {
      post = doc.data;
    } else {
      post = doc.data[0];
    }

    if (
      (post?.visibility === "PUBLIC" || post?.visibility === "UNLISTED") ||
      (post?.author === currentUser?.id || post?.author?.id === currentUser?.id ) ||
      (post?.visibility === "FRIENDS" && userFriends?.includes(post?.author)) ||
      (post?.visibility !== "FRIENDS" && post?.visibility !== "UNLISTED" && JSON.parse(post?.visibility).includes(currentUser?.displayName))
    ) {
      this.setState({ content: post.content });
    }
  };



  render() {
    const { content } = this.state;

    return (
      <div>
        <img src={content} alr="https://www.salonlfc.com/wp-content/uploads/2018/01/image-not-found-1-scaled-1150x647.png" style={{width: "80%"}} />
      </div>
    );
  }
}

// example
// http://localhost:3000/posts/nofun.herokuapp.com/78b7870cabb644edbd0c2e575e34db00/d2c668f29f8f40af85608c6197052c9e/image/

const mapStateToProps = (state) => ({
  currentUser: state.user.currentUser,
  userFriends: state.user.userFriends,
  domains: state.domain.domains
});

export default connect(mapStateToProps)(ImageDetail);
