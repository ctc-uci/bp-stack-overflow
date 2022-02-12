import React from 'react';
import PropTypes from 'prop-types';

import './LeaderboardEntry.css';

function LeaderboardEntry(props) {
  const { name, points } = props;

  return (
    <div className="Leaderboard">
      <div className="row gx-5 align-items-center">
        <div className="col-md-1">
          <h2>{name}</h2>
        </div>
        <div className="col-md-11">
          <em>{points}</em>
        </div>
      </div>
    </div>
  );
}

LeaderboardEntry.propTypes = {
  name: PropTypes.string,
  points: PropTypes.number,
};

LeaderboardEntry.defaultProps = {
  name: '',
  points: 0,
};

export default LeaderboardEntry;
