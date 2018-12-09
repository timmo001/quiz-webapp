import React, { Component } from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import Slide from '@material-ui/core/Slide';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
  grid: {
    height: '100%',
    padding: theme.spacing.unit * 2,
    overflow: 'auto'
  },
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

class Join extends Component {
  state = {
    open: true,
    id: '',
  };

  handleChange = event => this.setState({ id: event.target.value.toUpperCase() });

  render() {
    const { classes, handleCancel, handleJoin } = this.props;
    const { id } = this.state;
    return (
      <Grid
        className={classes.grid}
        container
        alignItems="center"
        justify="center">

        <Grid item lg={3} md={6} sm={6} xs={12}>
          <Slide in>
            <Card className={classes.card} elevation={2}>
              <CardContent className={classes.cardContent}>
                <Typography variant="h5" gutterBottom>
                  Join Game
                </Typography>
                <TextField
                  className={classes.input}
                  autoFocus
                  margin="dense"
                  id="id"
                  label="Session ID"
                  type="text"
                  inputProps={{
                    autoCapitalize: 'characters',
                  }}
                  autoComplete="off"
                  value={id}
                  onChange={this.handleChange}
                  onKeyPress={e => e.key === 'Enter' && handleJoin(id)}
                  fullWidth />
              </CardContent>
              <CardActions>
                <div className={classes.fill} />
                <Button color="primary" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button color="primary" onClick={() => handleJoin(id)}>
                  Join
                </Button>
              </CardActions>
            </Card>
          </Slide>
        </Grid>
      </Grid>
    );
  }
}

Join.propTypes = {
  classes: PropTypes.object.isRequired,
  handleCancel: PropTypes.func.isRequired,
  handleJoin: PropTypes.func.isRequired
};

export default withStyles(styles)(Join);
