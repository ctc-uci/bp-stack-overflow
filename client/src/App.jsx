import React from 'react';
import './App.css';

import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getAuth, signInWithRedirect, GoogleAuthProvider } from 'firebase/auth';

import logo from './logo.svg';

const firebaseConfig = {
  apiKey: 'AIzaSyAGBsHHYk34WoR8babtQuuAngAkTJCKTb8',
  authDomain: 'test-project-alpha-6c208.firebaseapp.com',
  projectId: 'test-project-alpha-6c208',
  storageBucket: 'test-project-alpha-6c208.appspot.com',
  messagingSenderId: '879261039329',
  appId: '1:879261039329:web:4bf6e1dfc5fa5c7789d5a0',
  measurementId: 'G-56WCVPWVXV',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const provider = new GoogleAuthProvider();
const auth = getAuth();

function login() {
  signInWithRedirect(auth, provider);
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
      </header>
    </div>
  );
}

export default App;
