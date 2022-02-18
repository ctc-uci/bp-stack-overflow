import React from 'react';
import { Container } from 'react-bootstrap';
import LeaderboardEntry from '../components/LeaderboardEntry/LeaderboardEntry';

function Leaderboard() {
  return (
    <div className="Leaderboard">
      <Container fluid className="vh 100">
        <h2>Leaderboard</h2>
        <LeaderboardEntry name="One" points={5} />
      </Container>
    </div>
  );
}

export default Leaderboard;
