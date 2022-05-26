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
    setUsers(data.result);
  }

  useEffect(() => {
    getLeaderboard();
  }, []);

  return (
    <div className="Container" style={{ minHeight: '70vh' }}>
      <div className="Leaderboard">
        <Container>
          <h1 className="mb-4">Leaderboard</h1>
          {users.map((group, index) => (
            <div key={group.id}>
              <LeaderboardEntry
                position={index + 1}
                name={group.id}
                picture={group.photo_url}
                points={group.points}
              />
              {index !== users.length - 1 ? <hr /> : null}
            </div>
          ))}
        </Container>
      </div>
    </div>
  );
}

export default Leaderboard;
