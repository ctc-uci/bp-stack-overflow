import React from 'react';
import { connectHits } from 'react-instantsearch-dom';
import { Link } from 'react-router-dom';

function Hits({ hits }) {
  return hits.map(hit => (
    <div key={hit.objectID} className="hit mb-4">
      <h2>
        <Link to={hit.path}>{hit.title}</Link>
      </h2>
      <p>{hit.body}</p>
    </div>
  ));
}

const NewHits = connectHits(Hits);

export default NewHits;
