import React, { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import LeaderboardEntry from '../components/LeaderboardEntry/LeaderboardEntry';
import { BACKEND_URL } from './Home/Home';

function Leaderboard() {
  const [users, setUsers] = useState([]);

  async function getLeaderboard() {
    // The incoming data should already be sorted in desc order
    const response = await fetch(`${BACKEND_URL}/api/leaderboard`);
    const data = await response.json();
    console.log(data.result);
    setUsers(data.result);
  }

  useEffect(() => {
    getLeaderboard();
  }, []);

  return (
    <div className="Leaderboard">
      <Container fluid className="vh 100">
        <h2>Leaderboard</h2>
        {users.map(group => (
          <LeaderboardEntry
            key={group.id}
            name={group.id}
            picture={group.photo_url}
            points={group.points}
          />
        ))}
      </Container>
    </div>
  );
}

export default Leaderboard;
