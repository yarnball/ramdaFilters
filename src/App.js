import React from 'react';
import { render } from 'react-dom';
import R from 'ramda';
import { x } from './dummyData.js';

const testFilter = R.pipe(
  R.prop('movies'),
  R.filter(
    R.both(
      R.where({ genres: R.pipe(R.pluck('name'), R.contains('SuperDooper')) }),
      R.where({ genres: R.pipe(R.pluck('name'), R.contains('Drama')) }),
      R.where({ genres: R.pipe(R.pluck('name'), R.contains('Book')) }),
    ),
  ),
);

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      movies: x.movies,
      selectedFilters: {},
    };
  }
  handleChange = genre => {
    const { selectedFilters } = this.state;
    const isCurrentlyActive = selectedFilters[genre];

    this.setState({
      selectedFilters: {
        ...selectedFilters,
        [genre]: !isCurrentlyActive,
      },
    });
  };
  testFilter = () => {
    this.setState({ movies: testFilter(x) });
  };
  uniqueGenres(movies) {
    return R.pipe(R.pluck('genres'), R.flatten, R.pluck('name'), R.uniq)(
      movies,
    );
  }
  render() {
    const { selectedFilters } = this.state;
    console.log(selectedFilters);
    const avGenres = Object.keys(this.state.movies).map(
      e => this.state.movies[e],
    );
    const filteredMovies = this.state.movies;
    return (
      <div>
        Filters:<br />
        {this.uniqueGenres(this.state.movies).map(e => (
          <Filter1
            key={e}
            genre={e}
            isActive={!!selectedFilters[e]}
            onChange={this.handleChange}
          />
        ))}
        <br />
        <button onClick={this.testFilter}>Test filter</button>
        <br />
        <h3>
          {filteredMovies.map(movies => (
            <li key={movies.id}> {movies.name} </li>
          ))}
        </h3>
      </div>
    );
  }
}

class Filter1 extends React.Component {
  handleClick = () => {
    this.props.onChange(this.props.genre);
  };

  render() {
    const { genre, isActive } = this.props;

    return (
      <button onClick={this.handleClick}>
        {genre}
        {' '}
        <strong>{isActive ? 'Active' : 'Inactive'}</strong>
      </button>
    );
  }
}

export default App;
