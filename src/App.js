import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import blueGrey from '@material-ui/core/colors/blueGrey';
import grey from '@material-ui/core/colors/grey';
import green from '@material-ui/core/colors/green';
import red from '@material-ui/core/colors/red';
import pink from '@material-ui/core/colors/pink';
import Root from './Components/Root';
import 'typeface-roboto';
import '@mdi/font/css/materialdesignicons.min.css';
import './App.css';

var themes = [
  {
    id: 1,
    name: 'Light',
    palette: {
      type: 'light',
      primary: blueGrey,
      secondary: blueGrey,
      mainBackground: grey[50],
      card: grey[100],
      menu: grey[100],
      correct: green[500],
      incorrect: red[500],
      contrastThreshold: 3,
      tonalOffset: 0.2
    }
  },
  {
    id: 2,
    name: 'Dark',
    palette: {
      type: 'dark',
      primary: blueGrey,
      secondary: blueGrey,
      mainBackground: grey[900],
      card: grey[800],
      menu: grey[800],
      correct: green[500],
      incorrect: red[500],
      contrastThreshold: 3,
      tonalOffset: 0.2
    }
  },
  {
    id: 3,
    name: 'Midnight',
    palette: {
      type: 'dark',
      primary: pink,
      secondary: pink,
      mainBackground: '#383c45',
      card: '#434954',
      menu: '#434954',
      correct: green[500],
      incorrect: red[500],
      contrastThreshold: 3,
      tonalOffset: 0.2
    }
  }
];

const defaultPalette = createMuiTheme({ palette: themes[0].palette });

class App extends Component {
  state = {
    theme: defaultPalette
  };

  setTheme = (id) => {
    const theme = themes.find(t => t.id === id);
    const palette = theme ? theme.palette : themes[0].palette;
    this.setState({
      theme: createMuiTheme({ palette })
    });
  };

  render() {
    const { theme } = this.state;
    return (
      <MuiThemeProvider theme={theme}>
        <Router>
          <Route render={props => (
            <Root
              themes={themes}
              theme={theme}
              setTheme={this.setTheme}
              {...props} />
          )} />
        </Router>
      </MuiThemeProvider>
    );
  }
}

export default App;