import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import Grid from '@material-ui/core/Grid';
import Slide from '@material-ui/core/Slide';
import Question from './Question';
import End from './End';

const styles = theme => ({
  grid: {
    height: '100%',
    paddingTop: theme.spacing.unit * 8,
    paddingBottom: theme.spacing.unit * 2,
    paddingLeft: theme.spacing.unit * 2,
    paddingRight: theme.spacing.unit * 2,
    overflow: 'auto'
  }
});

class Questions extends React.Component {
  state = {
    showCard: true,
    questionNo: 0,
    correctAnswers: [],
    incorrectAnswers: []
  }

  handleNext = (correct) => {
    this.setState({ showCard: false }, () => {
      setTimeout(() => {
        let { correctAnswers, incorrectAnswers, questionNo } = this.state;
        if (correct) correctAnswers.push(this.props.questions[questionNo]);
        else incorrectAnswers.push(this.props.questions[questionNo]);
        questionNo += 1;
        this.setState({ correctAnswers, incorrectAnswers, questionNo, showCard: true });
      }, 200);
    });
  };

  render() {
    const { classes, theme, voice, questions } = this.props;
    const { showCard, questionNo, correctAnswers, incorrectAnswers } = this.state;

    return (
      <Grid
        className={classes.grid}
        container
        alignItems="center"
        justify="center">
        <Grid item lg={3} md={6} sm={6} xs={12}>
          <Slide in={showCard}>
            {questionNo === questions.length ?
              <End
                correctAnswers={correctAnswers}
                incorrectAnswers={incorrectAnswers} />
              :
              <Question
                theme={theme}
                question={questions[questionNo]}
                voice={voice}
                handleNext={this.handleNext} />
            }
          </Slide>
        </Grid>
      </Grid>
    );
  }
}

Questions.propTypes = {
  classes: PropTypes.object.isRequired,
  themes: PropTypes.array.isRequired,
  theme: PropTypes.object.isRequired,
  voice: PropTypes.object,
  questions: PropTypes.array.isRequired
};

export default withStyles(styles)(Questions);