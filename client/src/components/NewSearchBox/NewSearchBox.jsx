import React from 'react';
import { connectSearchBox } from 'react-instantsearch-dom';
import PropTypes from 'prop-types';

/*
A search box incorporating Algolia's instant search

https://www.algolia.com/doc/api-reference/widgets/search-box/react/
*/

function SearchBox({ currentRefinement, refine }) {
  return (
    <form noValidate role="search">
      <div className="input-group mb-3">
        <span className="input-group-text">
          <i className="bi bi-search" />
        </span>
        <input
          type="search"
          className="form-control"
          value={currentRefinement}
          onChange={event => refine(event.currentTarget.value)}
          placeholder="Search for a post"
        />
      </div>
    </form>
  );
}

SearchBox.propTypes = {
  currentRefinement: PropTypes.string,
  refine: PropTypes.func,
};

SearchBox.defaultProps = {
  currentRefinement: '',
  refine: () => {},
};

const NewSearchBox = connectSearchBox(SearchBox);

export default NewSearchBox;
