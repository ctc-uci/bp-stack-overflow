import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import './LeaderboardEntry.css';

function LeaderboardEntry(props) {
  const { name, picture, points, position } = props;
  const [iconClass, setIconClass] = useState('');
  const [iconColor, setIconColor] = useState('');

  useEffect(() => {
    if (position === 1 || position === 2 || position === 3) {
      setIconClass('bi bi-trophy-fill');
    }
    if (position === 1) {
      setIconColor('gold');
    } else if (position === 2) {
      setIconColor('silver');
    } else if (position === 3) {
      setIconColor('#8C7853');
    }
  });

  return (
    <div className="Leaderboard">
      <div className="row gx-5 mb-3 align-items-center">
        <div className="col-md-2 text-center">
          <img
            src={picture}
            alt="placeholder"
            style={{ display: 'block', width: '60px', margin: 'auto', borderRadius: '50%' }}
          />
          {iconClass ? (
            <i
              className={iconClass}
              style={{
                color: iconColor,
                fontSize: '2.5em',
              }}
            />
          ) : (
            <p>{position}</p>
          )}
        </div>
        <div className="col-md-10">
          <h2>{name}</h2>
          <em>{points}</em>
        </div>
      </div>
    </div>
  );
}

LeaderboardEntry.propTypes = {
  name: PropTypes.string,
  picture: PropTypes.string,
  points: PropTypes.number,
  position: PropTypes.number,
};

LeaderboardEntry.defaultProps = {
  name: '',
  picture: `'http://placehold.it/'`,
  points: 0,
  position: 0,
};

export default LeaderboardEntry;
