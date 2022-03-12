import { React, useState } from 'react';
import { Table } from 'react-bootstrap';
import './LeaderboardEntry.css';

function LeaderboardEntry() {
  /*
    const [users, setUsers] = useState({});

    export const BACKEND_URL = 'http://localhost:8080';

    async function getLeaderboard() {
      // The incoming data should already be sorted in desc order
      const response = await fetch(`${BACKEND_URL}/api/leaderboard`);
      const data = response.json();
      setUsers(data);
    }
  */

  // Working with sample data first
  // Will switch to backend data after implementation
  const sampleData = {
    users: [
      {
        id: 'Mister A',
        points: 5,
      },
      {
        id: 'Mister B',
        points: 2,
      },
      {
        id: 'Mister C',
        points: 3,
      },
    ],
  };

  function renderUserData() {
    // Sorting function is here just for the given data, not need when fetching from database
    sampleData.users.sort((a, b) => b.points - a.points);
    return sampleData.users.map((user, index) => {
      const { id, points } = user;
      return (
        <tr key={id}>
          <td>
            {/* Have to see how the image part works, right now just placeholder */}
            <img src="http://placehold.it/" alt="placeholder" />
          </td>
          <td> {id} </td>
          <td> {points} </td>
        </tr>
      );
    });
  }

  return (
    <div className="Leaderboard">
      <div className="row gx-5 align-items-center">
        <Table>{renderUserData()}</Table>
      </div>
    </div>
  );
}

export default LeaderboardEntry;
