import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import Grid from '@material-ui/core/Grid';
import Slide from '@material-ui/core/Slide';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Question from './Question';
import End from './End';

const styles = theme => ({
  grid: {
    height: '100%',
    padding: theme.spacing.unit * 2,
    overflow: 'auto'
  }
});

class Questions extends React.Component {
  state = {
    waiting: true,
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
    const { classes, theme, voice, questions, host, players, waiting, handleReady } = this.props;
    const { showCard, questionNo, correctAnswers, incorrectAnswers } = this.state;

    return (
      <Grid
        className={classes.grid}
        container
        alignItems="center"
        justify="center">
        <Grid item lg={3} md={6} sm={6} xs={12}>
          <Slide in={showCard}>
            {waiting ?
              <div align="center">
                <Typography variant="subtitle1">
                  Waiting for other players...
                </Typography>
                {host &&
                  <Typography variant="subtitle2">
                    Player Count: {players}
                  </Typography>
                }
                {host &&
                  <Button color="primary" onClick={handleReady}>
                    Everyone&#39;s In
                  </Button>
                }
              </div>
              : questionNo === questions.length ?
                <End
                  voice={voice}
                  correctAnswers={correctAnswers}
                  incorrectAnswers={incorrectAnswers} />
                :
                <Question
                  theme={theme}
                  questionNo={questionNo}
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
  host: PropTypes.bool,
  players: PropTypes.number,
  voice: PropTypes.object,
  questions: PropTypes.array.isRequired,
  waiting: PropTypes.bool.isRequired,
  handleReady: PropTypes.func.isRequired
};

export default withStyles(styles)(Questions);