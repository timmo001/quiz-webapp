import React, { Component } from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import Snackbar from '@material-ui/core/Snackbar';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Slide from '@material-ui/core/Slide';
import FormatPaint from '@material-ui/icons/FormatPaint';
import RecordVoiceOver from '@material-ui/icons/RecordVoiceOver';
import normalizePort from './Common/normalizePort';
import Categories from './Categories';
import Questions from './Questions';

const styles = theme => ({
  root: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    maxHeight: '100%',
    maxWidth: '100%',
    background: theme.palette.background
  },
  center: {
    justifyContent: 'center',
    textAlign: 'center',
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translateX(-50%) translateY(-50%)'
  },
  progress: {
    marginBottom: theme.spacing.unit
  },
  buttons: {
    position: 'absolute',
    top: 0,
    right: 0,
    margin: theme.spacing.unit * 2
  },
  button: {
    height: 32,
    width: 32,
    color: theme.palette.text.light,
    margin: theme.spacing.unit,
    [theme.breakpoints.down('sm')]: {
      height: 26,
      width: 26,
      gridColumn: 1
    }
  },
  icon: {
    height: 22,
    width: 22,
    [theme.breakpoints.down('sm')]: {
      height: 18,
      width: 18
    },
    transform: 'translateY(-8px)'
  },
  menu: {
    marginTop: theme.spacing.unit * 6
  }
});

let ws;
class Root extends Component {
  state = {
    snackMessage: { open: false, text: '' },
    connected: false,
    anchorEl: null
  };

  componentDidMount = () => {
    this.setTheme();
    this.getTTS();
    this.connectToWS();
  };

  getTTS = () => window.speechSynthesis.onvoiceschanged = () => {
    const voices = window.speechSynthesis.getVoices();
    const storedVoiceName = localStorage.getItem('storedVoiceName');
    let voice
    if (storedVoiceName) voice = voices.find(v => v.name === storedVoiceName);
    this.setState({ voices, voice });
  };

  setTheme = (themeId = undefined) => {
    if (!themeId && themeId !== 0)
      themeId = Number(localStorage.getItem('theme'));
    this.props.setTheme(themeId);
    localStorage.setItem('theme', themeId);
  };

  connectToWS = () => {
    ws = new WebSocket(
      `${window.location.protocol === 'https:' ? 'wss' : 'ws'}://${window.location.hostname}:${normalizePort(process.env.PORT || '8080')}`
    );

    ws.onopen = () => {
      console.log("WebSocket connected");
      this.setState({ connected: true });
      ws.send(JSON.stringify({ request: 'categories' }));
    };

    ws.onmessage = (event) => {
      const response = JSON.parse(event.data);
      switch (response.request) {
        default:
          console.log(response);
          break;
        case 'categories':
          this.setState({ categories: response.data });
          break;
        case 'questions':
          this.setState({ questions: response.data });
          break;
      }
    };
  };

  handleGetQuestions = (amount, category, difficulty, type) => {
    ws.send(JSON.stringify({ request: 'questions', amount, category, difficulty, type }));
  };

  handleClose = () => this.setState({ snackMessage: { open: false, text: '' } });

  handleThemeClick = event => this.setState({ themeAnchorEl: event.currentTarget });

  handleThemeClose = (value) => this.setState({ themeAnchorEl: null }, () => {
    if (Number(value)) this.setTheme(value);
  });

  handleVoiceClick = event => this.setState({ voiceAnchorEl: event.currentTarget });

  handleVoiceClose = (voice) => this.setState({ voiceAnchorEl: null, voice }, () => {
    localStorage.setItem('storedVoiceName', this.state.voice.name);
  });

  render() {
    const { setTheme } = this;
    const { classes, themes, theme } = this.props;
    const { snackMessage, voiceAnchorEl, themeAnchorEl, voices, voice, connected, categories, questions } = this.state;

    return (
      <div className={classes.root}>
        <Slide in>
          <div className={classes.buttons}>
            <Tooltip title="Voice">
              <IconButton
                className={classes.button}
                aria-label="Voice"
                aria-owns={voiceAnchorEl ? 'voice' : null}
                aria-haspopup="true"
                onClick={this.handleVoiceClick}>
                <RecordVoiceOver className={classes.icon} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Theme">
              <IconButton
                className={classes.button}
                aria-label="Theme"
                aria-owns={themeAnchorEl ? 'theme' : null}
                aria-haspopup="true"
                onClick={this.handleThemeClick}>
                <FormatPaint className={classes.icon} />
              </IconButton>
            </Tooltip>
          </div>
        </Slide>

        <Menu
          id="voice"
          value={voice}
          className={classes.menu}
          anchorEl={voiceAnchorEl}
          open={Boolean(voiceAnchorEl)}
          onClose={this.handleVoiceClose}>
          {voices && voices.map((voice, x) => {
            return (
              <MenuItem key={x} onClick={() => this.handleVoiceClose(voice)}>{voice.name}</MenuItem>
            );
          })}
        </Menu>
        <Menu
          id="theme"
          value={theme}
          className={classes.menu}
          anchorEl={themeAnchorEl}
          open={Boolean(themeAnchorEl)}
          onClose={this.handleThemeClose}>
          {themes.map(theme => {
            return (
              <MenuItem key={theme.id} onClick={() => this.handleThemeClose(theme.id)}>{theme.name}</MenuItem>
            );
          })}
        </Menu>

        {questions ?
          <Questions
            themes={themes}
            theme={theme}
            voice={voice}
            questions={questions} />
          : categories ?
            <Categories
              themes={themes}
              theme={theme}
              categories={categories}
              setTheme={setTheme}
              handlePlay={this.handleGetQuestions} />
            :
            <div className={classes.center}>
              <CircularProgress className={classes.progress} />
              {connected ?
                <Typography variant="subheading">
                  Loading data..
                </Typography>
                :
                <Typography variant="subheading">
                  Attempting to connect..
                </Typography>
              }
            </div>
        }
        <Snackbar
          open={snackMessage.open}
          autoHideDuration={2000}
          onClose={this.handleClose}
          onExited={this.handleExited}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          ContentProps={{ 'aria-describedby': 'message-id' }}
          message={<span id="message-id">{snackMessage.text}</span>} />
      </div>
    );
  }
}

Root.propTypes = {
  classes: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  themes: PropTypes.array.isRequired,
  theme: PropTypes.object.isRequired,
  setTheme: PropTypes.func.isRequired
};

export default withStyles(styles)(Root);
