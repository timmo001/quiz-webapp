import React from 'react';
import PropTypes from 'prop-types';
import decode from 'unescape';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import shuffle from './Common/shuffle';

const styles = theme => ({
  grid: {
    height: '100%',
    paddingTop: theme.spacing.unit * 8,
    paddingBottom: theme.spacing.unit * 2,
    paddingLeft: theme.spacing.unit * 2,
    paddingRight: theme.spacing.unit * 2,
    overflow: 'auto'
  },
  formControl: {
    margin: theme.spacing.unit * 3
  },
  group: {
    margin: `${theme.spacing.unit}px 0`
  }
});

class Categories extends React.Component {
  state = {
    answer: ''
  };

  handleChange = event => this.setState({ value: event.target.value });

  render() {
    const { classes, question } = this.props;
    const { answer } = this.state;
    const answers = shuffle([...question.incorrect_answers, question.correct_answer]);

    return (
      <div>
        <Typography variant="title">
          {decode(question.question, 'all')}
        </Typography>

        <FormControl component="fieldset" className={classes.formControl}>
          <FormLabel component="legend">Select an answer</FormLabel>
          <RadioGroup
            aria-label="Select an answer"
            name="answer"
            className={classes.group}
            value={answer}
            onChange={this.handleChange}>
            {answers.map((answer, x) => {
              return (
                <FormControlLabel
                  key={x}
                  value={decode(answer)}
                  control={<Radio />}
                  label={answer} />
              );
            })}
          </RadioGroup>
        </FormControl>

      </div>
    );
  }
}

Categories.propTypes = {
  classes: PropTypes.object.isRequired,
  question: PropTypes.object.isRequired
};

export default withStyles(styles)(Categories);