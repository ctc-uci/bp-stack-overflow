import React from 'react';
import PropTypes from 'prop-types';

import './LeaderboardEntry.css';

function LeaderboardEntry(props) {
  const { name, picture, points } = props;

  return (
    <div className="Leaderboard">
      <div className="row gx-5 align-items-center">
        <img src={picture} alt="placeholder" />
        <h2>{name}</h2>
        <em>{points}</em>
      </div>
    </div>
  );
}

LeaderboardEntry.propTypes = {
  name: PropTypes.string,
  picture: PropTypes.string,
  points: PropTypes.number,
};

LeaderboardEntry.defaultProps = {
  name: '',
  picture: `'http://placehold.it/'`,
  points: 0,
};

export default LeaderboardEntry;
