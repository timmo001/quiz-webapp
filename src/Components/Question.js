import React from 'react';
import PropTypes from 'prop-types';
import ReactHtmlParser from 'react-html-parser';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Fab from '@material-ui/core/Fab';
import ArrowRight from '@material-ui/icons/ArrowRight';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import CircularProgress from '@material-ui/core/CircularProgress';
import shuffle from './Common/shuffle';
import correct from '../resources/correct.mp3';
import incorrect from '../resources/incorrect.mp3';

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
  },
  formControl: {
    margin: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 2}px 0 ${theme.spacing.unit * 2}px`
  },
  group: {
    margin: `${theme.spacing.unit}px 0`
  },
  center: {
    position: 'fixed',
    justifyContent: 'center',
    textAlign: 'center',
    top: 38,
    left: '50%',
    transform: 'translateX(-50%)'
  },
});

var speech;
class Question extends React.Component {
  state = {
    answer: '',
    showAnswer: false
  };

  componentDidMount = () => this.updateProps();

  componentDidUpdate = (prevProps) => {
    if (this.props.question !== prevProps.question)
      this.updateProps();
  };

  updateProps = () => this.props.question && this.setState({
    answer: '',
    answers: this.props.question.type === 'boolean' ?
      ['True', 'False'] :
      shuffle([...this.props.question.incorrect_answers, this.props.question.correct_answer])
  }, () => this.playQuestion());

  speak = (text) => {
    if (this.props.voice) {
      speech = new SpeechSynthesisUtterance();
      speech.voice = this.props.voice;
      speech.text = text;
      speechSynthesis.speak(speech);
    }
  };

  playQuestion = () => {
    speechSynthesis.cancel();
    this.speak(ReactHtmlParser(this.props.question.question));
    this.state.answers.map(answer => {
      return this.speak(ReactHtmlParser(answer));
    });
  };

  handleChange = event => this.setState({ [event.target.name]: event.target.value });

  handleNext = () => this.setState({ showAnswer: true }, () => {
    speechSynthesis.cancel();
    if (this.state.answer === this.props.question.correct_answer)
      new Audio(correct).play();
    else
      new Audio(incorrect).play();
    setTimeout(() => this.setState({ showAnswer: false }, () => {
      this.props.handleNext(this.state.answer === this.props.question.correct_answer);
    }), 2000);
  });

  render() {
    const { classes, theme, questionNo, question } = this.props;
    const { answers, answer, showAnswer } = this.state;

    return (
      <Card className={classes.card} elevation={2}>
        {question && answers ?
          <CardContent className={classes.cardContent}>
            <Typography variant="h6">
              {questionNo + 1}. {ReactHtmlParser(question.question)}
            </Typography>
            <Typography variant="body1">
              {ReactHtmlParser(question.category)}
            </Typography>

            <FormControl component="fieldset" className={classes.formControl}>
              <RadioGroup
                aria-label="Select an answer"
                name="answer"
                className={classes.group}
                value={answer}
                onChange={this.handleChange}>
                {answers.map((i, x) => {
                  return (
                    <FormControlLabel
                      key={x}
                      value={i}
                      disabled={showAnswer}
                      control={<Radio />}
                      label={
                        <span
                          style={{
                            color: showAnswer &&
                              question.correct_answer === i ?
                              theme.palette.correct :
                              showAnswer && answer === i && question.correct_answer !== i && theme.palette.incorrect
                          }}>
                          {ReactHtmlParser(i)}
                        </span>
                      } />
                  );
                })}
              </RadioGroup>
            </FormControl>
          </CardContent>
          :
          <CardContent className={classes.cardContent}>
            <div className={classes.center}>
              <CircularProgress className={classes.progress} />
              <Typography variant="subtitle1">
                Loading..
              </Typography>
            </div>
          </CardContent>
        }
        <CardActions>
          <div className={classes.fill} />
          <Fab
            color="primary"
            className={classes.button}
            disabled={answer === '' || showAnswer}
            onClick={this.handleNext}>
            <ArrowRight />
          </Fab>
          <div className={classes.fill} />
        </CardActions>
      </Card>
    );
  }
}

Question.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  voice: PropTypes.object,
  questionNo: PropTypes.number.isRequired,
  question: PropTypes.object.isRequired,
  handleNext: PropTypes.func.isRequired
};

export default withStyles(styles)(Question);