import React from 'react';
import { connectHits } from 'react-instantsearch-dom';
import { Link } from 'react-router-dom';

/*
A hit is an individual search result. Like the NewSearchBox component,
Hits is modeled after Algolia's Hits.
*/
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
