import React from 'react';
import './App.css';

import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getAuth, signInWithRedirect, GoogleAuthProvider } from 'firebase/auth';

import logo from './logo.svg';

const firebaseConfig = {
  apiKey: 'AIzaSyCMz9kvTfHzop70iJ8wzgY8v7orQhjHADE',

  authDomain: 'ctcoverflow.firebaseapp.com',

  projectId: 'ctcoverflow',

  storageBucket: 'ctcoverflow.appspot.com',

  messagingSenderId: '119770833435',

  appId: '1:119770833435:web:a4c140d8ab10a77395cebe',

  measurementId: 'G-GN5NEXY84Y',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const provider = new GoogleAuthProvider();
const auth = getAuth();

function login() {
  signInWithRedirect(auth, provider);
}

function grab() {
  const req = new XMLHttpRequest();
  const url = '/api/inc';
  req.open('GET', url);
  req.send();
  req.onload = function () {
    document.getElementById('inc').innerHTML = req.responseText;
  };
}

function loadPosts() {
  const req = new XMLHttpRequest();
  const url = '/api/read';
  req.open('GET', url);
  req.send();
  req.onload = function () {
    document.getElementById('posts').innerHTML = req.responseText;
  };
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <button onClick={login} type="button">
          Click Me
        </button>
        <button onClick={grab} type="button" id="inc">
          Incrementor Button.
        </button>

        <form action="/api/add" method="POST">
          <label htmlFor="body">
            Body:
            <input type="text" name="body" id="body" />
          </label>
          <input type="submit" value="Submit" />
        </form>

        <button onClick={loadPosts} type="button">
          Load Posts.
        </button>

        <p id="posts"> Posts will load here! </p>
      </header>
    </div>
  );
}

export default App;
