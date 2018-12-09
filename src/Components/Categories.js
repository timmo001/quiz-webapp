import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Slide from '@material-ui/core/Slide';

const styles = theme => ({
  grid: {
    height: '100%',
    paddingTop: theme.spacing.unit * 8,
    paddingBottom: theme.spacing.unit * 2,
    paddingLeft: theme.spacing.unit * 2,
    paddingRight: theme.spacing.unit * 2,
    overflow: 'auto'
  },
  card: {
    background: theme.palette.card
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
  },
  menu: {
    background: theme.palette.menu
  }
});

class Categories extends React.Component {
  state = {
    category: '',
    difficulty: '',
    type: '',
    amount: 15
  };

  handleChange = event => this.setState({ [event.target.name]: event.target.value });

  handlePlay = () => this.props.handlePlay(this.state.amount, this.state.category, this.state.difficulty, this.state.type);

  render() {
    const { classes, categories } = this.props;

    return (
      <Grid
        className={classes.grid}
        container
        alignItems="center"
        justify="center">

        <Grid item lg={3} md={6} sm={6} xs={12}>
          <Slide in>
            <Card className={classes.card} elevation={2}>
              <CardContent className={classes.cardContent} component="form">
                <Typography variant="headline" align="center">
                  Welcome!
                </Typography>

                <FormControl className={classes.formControl}>
                  <InputLabel shrink htmlFor="category">
                    Category
                  </InputLabel>
                  <Select
                    value={this.state.category}
                    onChange={this.handleChange}
                    input={<Input name="category" id="category" />}
                    displayEmpty
                    name="category"
                    MenuProps={{ MenuListProps: { className: classes.menu } }}>
                    <MenuItem value={''}>Any</MenuItem>
                    {categories.map((category, x) => {
                      return (
                        <MenuItem key={x} value={category.id}>{category.name}</MenuItem>
                      )
                    })}
                  </Select>
                </FormControl>

                <FormControl className={classes.formControl}>
                  <InputLabel shrink htmlFor="difficulty">
                    Difficulty
                  </InputLabel>
                  <Select
                    value={this.state.difficulty}
                    onChange={this.handleChange}
                    input={<Input name="difficulty" id="difficulty" />}
                    displayEmpty
                    name="difficulty"
                    MenuProps={{ MenuListProps: { className: classes.menu } }}>
                    <MenuItem value={''}>Any</MenuItem>
                    <MenuItem value={'easy'}>Easy</MenuItem>
                    <MenuItem value={'medium'}>Medium</MenuItem>
                    <MenuItem value={'hard'}>Hard</MenuItem>
                  </Select>
                </FormControl>

                <FormControl className={classes.formControl}>
                  <InputLabel shrink htmlFor="type">
                    Type of questions
                  </InputLabel>
                  <Select
                    value={this.state.type}
                    onChange={this.handleChange}
                    input={<Input name="type" id="type" />}
                    displayEmpty
                    name="type"
                    MenuProps={{ MenuListProps: { className: classes.menu } }}>
                    <MenuItem value={''}>Both</MenuItem>
                    <MenuItem value={'multiple'}>Multiple Choice</MenuItem>
                    <MenuItem value={'boolean'}>True / False</MenuItem>
                  </Select>
                </FormControl>

                <FormControl className={classes.formControl}>
                  <InputLabel shrink htmlFor="amount">
                    Amount of questions
                  </InputLabel>
                  <Select
                    value={this.state.amount}
                    onChange={this.handleChange}
                    input={<Input name="amount" id="amount" />}
                    displayEmpty
                    name="amount"
                    MenuProps={{ MenuListProps: { className: classes.menu } }}>
                    <MenuItem value={5}>5</MenuItem>
                    <MenuItem value={10}>10</MenuItem>
                    <MenuItem value={15}>15</MenuItem>
                    <MenuItem value={20}>20</MenuItem>
                    <MenuItem value={25}>25</MenuItem>
                    <MenuItem value={30}>30</MenuItem>
                    <MenuItem value={35}>35</MenuItem>
                    <MenuItem value={40}>40</MenuItem>
                    <MenuItem value={45}>45</MenuItem>
                    <MenuItem value={50}>50</MenuItem>
                  </Select>
                </FormControl>
              </CardContent>
              <CardActions>
                <div className={classes.fill} />
                <Button
                  className={classes.button}
                  variant="contained"
                  color="primary"
                  onClick={this.handlePlay}>
                  Play
                </Button>
                <div className={classes.fill} />
              </CardActions>
            </Card>
          </Slide>
        </Grid>
      </Grid >
    );
  }
}

Categories.propTypes = {
  classes: PropTypes.object.isRequired,
  categories: PropTypes.array.isRequired,
  setTheme: PropTypes.func.isRequired,
  handlePlay: PropTypes.func.isRequired,
  voice: PropTypes.object
};

export default withStyles(styles)(Categories);