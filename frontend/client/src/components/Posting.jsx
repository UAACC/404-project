import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import CommentIcon from "@material-ui/icons/Comment";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Collapse from "@material-ui/core/Collapse";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import { red } from "@material-ui/core/colors";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { CardActionArea } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  media: {
    height: 0,
    paddingTop: "56.25%", // 16:9
  },
  expand: {
    transform: "rotate(0deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: "rotate(180deg)",
  },
  avatar: {
    backgroundColor: red[500],
  },
}));

export default function RecipeReviewCard(props) {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);

  return (
    <Card className={classes.root} style={{ margin: "auto", backgroundImage: "linear-gradient(to right, #336699, #3399CC, #66FFFF)" }}>
      <CardActionArea onClick={() => props.handleClick()}>
        <CardHeader
          avatar={
            <Avatar
              aria-label="recipe"
              style={{ backgroundColor: "grey" }}
              className={classes.avatar}
            ></Avatar>
          }
          action={
            <IconButton aria-label="settings">
              <MoreVertIcon />
            </IconButton>
          }
          title={props.post.title}
          subheader={props.post.published.split("T")[0]}
        />

        {props.post.contentType.includes("image") && (
          <CardMedia
            className={classes.media}
            image={props.post.content}
            style={{
              paddingTop: "56.25%",
              marginLeft: "5%",
              marginRight: "5%",
              maxWidth: "500px",
            }}
          />
        )}
        <CardContent>
          <Typography variant="body2" color="textSecondary" component="p">
            {!props.post.contentType.includes("image") && props.post.content}
          </Typography>
        </CardContent>
        <Typography
          variant="body2"
          style={{
            color: "green",
            marginLeft: "3%",
            marginBottom: "2%",
            alignItems: "flex-end",
          }}
        >
          {props.post.author.id ===
            props.post.origin.split("/")[0] +
              "/" +
              props.post.origin.split("/")[1] +
              "/" +
              props.post.origin.split("/")[2] +
              "/" +
              props.post.origin.split("/")[3] +
              "/" +
              props.post.origin.split("/")[4] ||
          props.post.author ===
            props.post.origin.split("/")[0] +
              "/" +
              props.post.origin.split("/")[1] +
              "/" +
              props.post.origin.split("/")[2] +
              "/" +
              props.post.origin.split("/")[3] +
              "/" +
              props.post.origin.split("/")[4]
            ? "Original"
            : "Shared"}
        </Typography>
      </CardActionArea>
    </Card>
  );
}
