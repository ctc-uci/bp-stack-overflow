import React from 'react';
import { connectHits } from 'react-instantsearch-dom';
import { Link } from 'react-router-dom';

function Hits({ hits }) {
  console.log(hits);
  return hits.map(hit => (
    <div key={hit.objectID} className="hit">
      <h2>
        <Link to={hit.path}>{hit.title}</Link>
      </h2>
      <p>{hit.body}</p>
    </div>
  ));
}

const NewHits = connectHits(Hits);

export default NewHits;
