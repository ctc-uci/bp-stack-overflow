import React from 'react';
import { format } from 'date-fns';
import Post from '../../components/Post/Post';
import './Home.css';

const days = [];
for (let i = 0; i < 5; i += 1) {
  const day = new Date();
  day.setDate(day.getDate() - i);
  days.push(format(day, 'eeee LLLL d, yyyy'));
}

function Home() {
  return (
    <div className="Home">
      <div className="container">
        <div className="input-group w-75 mx-auto my-5">
          <div className="input-group-text">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-search"
              viewBox="0 0 16 16"
            >
              <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
            </svg>
          </div>
          <input
            type="search"
            id="f_query"
            className="form-control"
            placeholder="Search"
            rel="search"
          />
        </div>
        {days.map(date => {
          return (
            <div
              className="row justify-content-md-center"
              key={date}
              style={{ marginBottom: '2rem' }}
            >
              <div className="col-md-12">
                <h1 style={{ marginBottom: '1.5rem' }}>{date}</h1>
                <Post
                  date="9:00AM"
                  question="Git Shows Weird Error Message When Committing"
                  author="Sam Der"
                  description="I typed in 'git commit -m', but an error message popped up and I can't really..."
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Home;
