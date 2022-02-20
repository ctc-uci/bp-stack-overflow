import { React, useState, useEffect } from 'react';
import { format, parse } from 'date-fns';
import { Link } from 'react-router-dom';
import './Home.css';

// CHANGE LATER WHEN DEPLOYING
const BACKEND_URL = 'http://localhost:8080';

async function grab() {
  const response = await fetch(`${BACKEND_URL}/api/inc`);
  return response.json();
}

async function loadPosts() {
  // Load posts using JS's built in fetch API
  // Asynchronously fetch the data as a backend (returned as a Promise object containing the data)
  const response = await fetch(`${BACKEND_URL}/api/searchPosts?answered=false&page=0+`);
  return response.json();
}

async function formatPosts() {
  // With the Promise object containing the data, group each post by their dates and store
  // them in an Object (JS's version of a dictionary).
  const formatted = await loadPosts();
  const posts = {};
  formatted.result.forEach(element => {
    const date = format(parse(element.date, 'MM/dd/yyyy', new Date()), 'LLLL d, yyyy');
    if (posts[date] == null) {
      posts[date] = [];
    }
    posts[date].push(element);
  });

  return posts;
}

function Home() {
  const [postElements, setPostElements] = useState([]);
  useEffect(() => {
    formatPosts().then(posts => {
      // Build JSX elements for each post and store them in a list.
      const postElementList = [];

      // We want posts in reverse chronological order.
      const postKeys = Object.keys(posts);
      postKeys.sort();
      postKeys.reverse();
      postKeys.forEach(key => {
        const element = (
          <section key={key} className="date">
            <h1 className="mb-3">{key}</h1>
            {posts[key].map(p => {
              const { id, title, body, author } = p;
              return (
                <div key={id} className="post mb-4">
                  <h2>
                    {/* <a href={`/post/${id}`}>{title}</a> */}
                    <Link to={`/post/${id}`}>{title}</Link>
                  </h2>
                  <p className="m-0">
                    <em>{author}</em>
                  </p>
                  <p>{body}</p>
                </div>
              );
            })}
          </section>
        );
        postElementList.push(element);
      });

      // Update postElements so they can be rendered to the screen
      setPostElements(postElementList);
    });
  }, []);
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
        {postElements}
      </div>
    </div>
  );
}

export default Home;
