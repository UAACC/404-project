import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import AccountBoxIcon from "@material-ui/icons/AccountBox";
import DeleteIcon from "@material-ui/icons/Delete";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import Grid from "@material-ui/core/Grid";
import { sizing } from "@material-ui/system";
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import Paper from "@material-ui/core/Paper";
import { connect } from "react-redux";
import axios from "axios";
import { LocalConvenienceStoreOutlined } from "@material-ui/icons";

axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = 'X-CSRFToken'

class CommentCard extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      comment: this.props.comment,
      author: null
    }
  }

  componentDidMount = async() => {
    const { comment } = this.state;
    console.log(comment);
    if (comment) {
      const doc = await axios.get('/api/authors/'+this.state.comment.author+'/');
    this.setState({author: doc.data});
    }
    
  }

  handleDelete = async() => {
    const { comment } = this.state;

    await axios.delete('/api/comments/'+ comment.id);
    this.props.handleClick();
  }

  render(){
    const { author, comment } = this.state;
    return (
      <Paper style={{ overflow: "auto", marginRight:"20%", marginTop: '2%' }}>
        <Card>
          <CardContent width={1}>
            <Typography variant="body1" component="h4">
              User Name: <b>{author ? author.username : "Loading ... "}</b>
            </Typography>
            <Typography variant="body1" component="h4">
              Content: {comment ? comment.content : "Loading ... "}
            </Typography>
            {
              this.props.currentUser && this.props.currentUser.id === comment.author ?
              <div>
                <Button variant="contained" color="secondary" style={{marginLeft:"80%"}} onClick={this.handleDelete}>
                  Delete
                </Button>
              </div>
              : null
            }
          </CardContent>
        </Card>
      </Paper>
    )
  }
}

const mapStateToProps = (state) => ({
  currentUser: state.user.currentUser,
});

export default connect(mapStateToProps)(CommentCard);