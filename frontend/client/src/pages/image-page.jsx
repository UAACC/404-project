import React from "react";
import axios from "axios";
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
      (post?.visibility === "FRIENDS" && (userFriends?.includes(post?.author) || userFriends?.includes(post?.author.id))) ||
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

const mapStateToProps = (state) => ({
  currentUser: state.user.currentUser,
  userFriends: state.user.userFriends,
  domains: state.domain.domains
});

export default connect(mapStateToProps)(ImageDetail);
