import React from 'react';
import PropTypes from 'prop-types';
import { Highlight } from 'react-instantsearch-dom';

function Hit({ hit }) {
  console.log(hit);
  return (
    <div className="Hit">
      <p>{hit.title}</p>
    </div>
  );
}

Hit.propTypes = {
  hit: PropTypes.objectOf(PropTypes.object),
};

Hit.defaultProps = {
  hit: {},
};

export default Hit;
