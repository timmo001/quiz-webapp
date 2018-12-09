import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Fab from '@material-ui/core/Fab';
import Refresh from '@material-ui/icons/Refresh';

const styles = theme => ({
  card: {
    background: theme.palette.card
  },
  cardContent: {
    minHeight: 100,
    display: 'flex',
    flexDirection: 'column'
  },
  fill: {
    flexGrow: 1
  }
});

class End extends React.Component {

  handleRestart = () => window.location.reload(true);

  render() {
    const { classes, correctAnswers, incorrectAnswers } = this.props;

    return (
      <Card className={classes.card} elevation={2}>
        <CardContent className={classes.cardContent}>
          <Typography variant="headline">
            End Game
          </Typography>
          <Typography variant="subheading">
            Correct: {correctAnswers.length}
          </Typography>
          <Typography variant="subheading">
            Incorrect: {incorrectAnswers.length}
          </Typography>

        </CardContent>
        <CardActions>
          <div className={classes.fill} />
          <Fab mini color="primary" className={classes.button} onClick={this.handleRestart}>
            <Refresh />
          </Fab>
          <div className={classes.fill} />
        </CardActions>
      </Card>
    );
  }
}

End.propTypes = {
  classes: PropTypes.object.isRequired,
  correctAnswers: PropTypes.array.isRequired,
  incorrectAnswers: PropTypes.array.isRequired
};

export default withStyles(styles)(End);