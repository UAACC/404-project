import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import DeleteIcon from '@material-ui/icons/Delete';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import PersonAddIcon from '@material-ui/icons/PersonAdd';


const useStyles = makeStyles({
  root: {
    minWidth: 275,
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 25,
    fontStyle: 'italic',
  },
  pos: {
    marginBottom: 12,
  },
});

export default function OutlinedCard() {
  const classes = useStyles();
  const bull = <span className={classes.bullet}>•</span>;

  return (
    <Card className={classes.root} variant="outlined">
      <CardContent>
        <Typography className={classes.title} color="textSecondary" gutterBottom>
          <AccountBoxIcon fontSize="large"></AccountBoxIcon>
          User Profile
        </Typography>
        <Typography variant="h6" component="h4">
          Displayname：
        </Typography>
        <Typography variant="h6" component="h4">
          Username：
        </Typography>
        <Typography variant="h6" component="h4">
          Useremail：
        </Typography>
        <Typography variant="h6" component="h4">
            GitHub:
        </Typography>
        <div className="row">
        <Typography variant="h6" component="h4">
            Bio: 
        </Typography>
        <Typography variant="body3" component="p" style = {{marginLeft:"50px"}}>
          hello everybody
          <br />
        </Typography>
        </div>
        
      </CardContent>
      <CardActions>
        <Button
        variant="contained"
        color="primary"
        startIcon={<MoreHorizIcon />}
        style={{ marginLeft: "10px",marginBottom: "10px" }}
      >
        Learn More
      </Button>
      <Button
        variant="contained"
        color="primary"
        startIcon={<PersonAddIcon />}
        style={{ marginLeft: "10px",marginBottom: "10px" }}
      >
        Be/unfriend
      </Button>
      </CardActions>
    </Card>
  );
}