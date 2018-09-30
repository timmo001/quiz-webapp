import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import IconButton from '@material-ui/core/IconButton';
import Slide from '@material-ui/core/Slide';
import ArrowRight from '@material-ui/icons/ArrowRight';
import Question from './Question';

const styles = theme => ({
  grid: {
    height: '100%',
    paddingTop: theme.spacing.unit * 8,
    paddingBottom: theme.spacing.unit * 2,
    paddingLeft: theme.spacing.unit * 2,
    paddingRight: theme.spacing.unit * 2,
    overflow: 'auto'
  },
  cardContent: {
    display: 'flex',
    flexDirection: 'column'
  },
  formControl: {
    flex: '1 1 auto',
    margin: theme.spacing.unit
  },
  fill: {
    flexGrow: 1
  }
});

class Categories extends React.Component {

  handleChange = event => this.setState({ [event.target.name]: event.target.value });

  render() {
    const { classes, questions } = this.props;

    console.log(questions);

    return (
      <Grid
        className={classes.grid}
        container
        alignItems="center"
        justify="center">
        <Grid item lg={3} md={6} sm={6} xs={12}>
          <Slide in>
            <Card className={classes.card}>
              <CardContent className={classes.cardContent}>
                {questions.map((question, x) => {
                  return (
                    <Question
                      key={x}
                      question={question} />
                  );
                })}
              </CardContent>
              <CardActions>
                <div className={classes.fill} />
                <IconButton className={classes.button} onClick={this.handleNext}>
                  <ArrowRight />
                </IconButton>
                <div className={classes.fill} />
              </CardActions>
            </Card>
          </Slide>
        </Grid>
      </Grid>
    );
  }
}

Categories.propTypes = {
  classes: PropTypes.object.isRequired,
  themes: PropTypes.array.isRequired,
  theme: PropTypes.object.isRequired,
  questions: PropTypes.array.isRequired
};

export default withStyles(styles)(Categories);