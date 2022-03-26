import React from 'react';
import algoliasearch from 'algoliasearch/lite';
import { InstantSearch } from 'react-instantsearch-dom';
import NewSearchBox from '../../components/NewSearchBox/NewSearchBox';
import NewHits from '../../components/NewHits/NewHits';
import Hit from '../../components/Hit/Hit';
import './Home.css';

// CHANGE LATER WHEN DEPLOYING
export const BACKEND_URL = 'http://localhost:8080';

const SEARCH_CLIENT = algoliasearch('UWK1WLGVN7', 'bf93f344548b12528c334d157015180c');

function Home() {
  return (
    <div className="Home">
      <div className="container">
        <InstantSearch searchClient={SEARCH_CLIENT} indexName="postsIndex">
          <NewSearchBox />
          <NewHits hitComponent={Hit} />
        </InstantSearch>
      </div>
    </div>
  );
}

export default Home;
