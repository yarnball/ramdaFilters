import React from 'react';
import { reject, pluck, prop, filter, allPass, pipe, where, contains, flatten, uniqBy, } from 'ramda';
import { x } from './dummyData.js';


const andFilter = (x, filters) => {
    // if we have no filters, we just return everything
    if (filters.length === 0) {
      return x.movies;
    }

    const wheres = filters.map(g => where({
      genres: pipe(pluck('name'), contains(g))
    }));
  
    return pipe(
      prop('movies'),
      filter(
        allPass(wheres)
      )
    )(x);
}


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedFilters: {},
    };
  }
  
  handleChange = genre => {
    const { selectedFilters } = this.state;
    selectedFilters[genre.name] = !selectedFilters[genre.name];
    this.setState({
      selectedFilters: {
        ...reject(v => !v, selectedFilters),
      },
    });
  };

  uniqueGenres(movies) {
    return pipe(pluck('genres'), flatten, (uniqBy(prop('name'))), )(movies);
  }
    
  render() {
    const { selectedFilters } = this.state;
    console.log(selectedFilters);

    const filteredResults = andFilter(x, Object.keys(selectedFilters));

    return (
      <div>
        Filters:<br />
        {this.uniqueGenres(filteredResults).map(e => (
          <Filter1
            key={e.id}
            genre={e}
            isActive={!!selectedFilters[e.name]}
            onChange={this.handleChange}
          />
        ))}
        <br />
        <h3>
          {filteredResults.map(movies => (
            <Results key={movies.id} result={movies} />
          ))}
        </h3>
      </div>
    );
  }
}
class Results extends React.Component {
  render() {
    const { result } = this.props;

    return (
      <div>
        <li>
          {result.name}
        </li>
        <il>
          {result.genres.map(e => <span key={e.id}> {e.name} </span>)}
        </il>
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
        {genre.name}
        {' '}
        <strong>{isActive ? 'Active' : 'Inactive'}</strong>
      </button>
    );
  }
}

export default App;