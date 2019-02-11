import React, { Component } from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Slide from '@material-ui/core/Slide';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import FormatPaint from '@material-ui/icons/FormatPaint';
import RecordVoiceOver from '@material-ui/icons/RecordVoiceOver';
import normalizePort from './Common/normalizePort';
import Join from './Join';
import Categories from './Categories';
import Questions from './Questions';

const styles = theme => ({
  root: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    maxHeight: '100%',
    maxWidth: '100%',
    background: theme.palette.mainBackground
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
    display: 'flex',
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
  },
  session: {
    background: theme.palette.card,
  }
});

let ws;
class Root extends Component {
  state = {
    snackMessage: { open: false, text: '' },
    connected: false,
    joinOpen: false,
    host: false,
    waiting: true,
    players: 1
  };

  componentDidMount = () => {
    this.setTheme();
    this.getTTS();
    this.connectToWS();
  };

  getTTS = () => window.speechSynthesis.onvoiceschanged = () => {
    const voices = window.speechSynthesis.getVoices().filter(v => v.lang.startsWith('en'));
    const storedVoiceName = localStorage.getItem('storedVoiceName');
    let voice;
    if (storedVoiceName) voice = voices.find(v => v.name === storedVoiceName);
    if (!voice) voice = voices.find(v => v.lang === 'en-GB');
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
      `${window.location.protocol === 'https:' ? 'wss' : 'ws'}://${
      process.env.REACT_APP_WS_URL || window.location.hostname}:${normalizePort(process.env.REACT_APP_WS_PORT || '8080')}`
    );

    ws.onopen = () => {
      console.log('WebSocket connected');
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
        case 'session':
          this.setState({
            session: response.data.session,
            questions: response.data.questions,
            host: true
          });
          break;
        case 'join':
          if (response.session === this.state.session)
            this.setState({
              questions: response.data.questions,
              players: this.state.players + 1,
              joinOpen: false
            });
          break;
        case 'ready':
          if (response.session === this.state.session)
            this.setState({ waiting: false });
          break;
      }
    };
  };

  handleGetQuestions = (amount, category, difficulty, type) => {
    ws.send(JSON.stringify({ request: 'session', amount, category, difficulty, type }));
  };

  handleThemeClick = event => this.setState({ themeAnchorEl: event.currentTarget });

  handleThemeClose = theme => this.setState({ themeAnchorEl: null }, () => {
    if (theme && Number(theme)) this.setTheme(theme);
  });

  handleVoiceClick = event => this.setState({ voiceAnchorEl: event.currentTarget });

  handleVoiceClose = voice => this.setState({
    voiceAnchorEl: null, voice: voice ? voice : this.state.voice
  }, () => {
    this.state.voice && localStorage.setItem('storedVoiceName', this.state.voice.name);
  });

  handleJoinOpen = () => this.setState({ joinOpen: true });

  handleJoin = session => this.setState({ session }, () =>
    ws.send(JSON.stringify({ request: 'join', session })));

  handleReady = () =>
    ws.send(JSON.stringify({ request: 'ready', session: this.state.session }));

  render() {
    const { setTheme } = this;
    const { classes, themes, theme } = this.props;
    const { voiceAnchorEl, themeAnchorEl, voices, voice, connected, categories,
      questions, session, joinOpen, host, players, waiting } = this.state;

    return (
      <div className={classes.root}>
        <Slide in>
          <div className={classes.buttons}>
            <Tooltip title="Voice">
              <div>
                <IconButton
                  className={classes.button}
                  aria-label="Voice"
                  aria-owns={voiceAnchorEl ? 'voice' : null}
                  aria-haspopup="true"
                  disabled={voices ? voices.length < 1 ? true : false : true}
                  onClick={this.handleVoiceClick}>
                  <RecordVoiceOver className={classes.icon} />
                </IconButton>
              </div>
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
          onClose={() => this.handleVoiceClose(undefined)}>
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
          onClose={() => this.handleThemeClose(undefined)}>
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
            host={host}
            players={players}
            waiting={waiting}
            handleReady={this.handleReady}
            questions={questions} />
          : joinOpen ?
            <Join
              handleCancel={() => this.setState({ joinOpen: false })}
              handleJoin={this.handleJoin} />
            : categories ?
              <Categories
                themes={themes}
                theme={theme}
                voice={voice}
                categories={categories}
                setTheme={setTheme}
                handlePlay={this.handleGetQuestions} />
              :
              <div className={classes.center}>
                <CircularProgress className={classes.progress} />
                {connected ?
                  <Typography variant="subtitle1">
                    Loading data..
                  </Typography>
                  :
                  <Typography variant="subtitle1">
                    Attempting to connect..
                  </Typography>
                }
              </div>
        }

        {!joinOpen &&
          <Snackbar open anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
            <SnackbarContent
              className={classes.session}
              message={session ?
                <Typography variant="subtitle1">
                  Session ID: {session}
                </Typography>
                :
                <Typography variant="subtitle1">
                  Join another game
                </Typography>
              }
              action={!session &&
                <Button color="primary" align="center" onClick={this.handleJoinOpen}>
                  Join
                </Button>
              }
            />
          </Snackbar>
        }
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
