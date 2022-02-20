import { React, useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Nav, NavDropdown, Navbar, Container } from 'react-bootstrap';
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  setPersistence,
  browserLocalPersistence,
  onAuthStateChanged,
  signOut,
} from 'firebase/auth';

import Help from './pages/Help';
import Home from './pages/Home/Home';
import Leaderboard from './pages/Leaderboard';
import ProjectSubmission from './pages/ProjectSubmission';
import Profile from './pages/Profile/Profile';
import ViewPost from './pages/ViewPost/ViewPost';
import './App.css';
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
  setPersistence(auth, browserLocalPersistence).then(() => {
    signInWithPopup(auth, provider)
      .then(result => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const { user } = result.user;
        // ...
        window.location.reload();
      })
      .catch(error => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });
  });
}

function logout() {
  signOut(auth);
  window.location.reload();
}

let leaderboardActive = '';
let projectIdeasActive = '';
let helpActive = '';

const currentURL = new URL(window.location.href);

switch (currentURL.pathname) {
  case '/leaderboard':
    leaderboardActive = 'true';
    break;
  case '/project-submission':
    projectIdeasActive = 'true';
    break;
  case '/help':
    helpActive = 'true';
    break;
  default:
    break;
}

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [loadedAuthUI, setLoadedAuthUI] = useState(false);
  useEffect(() => {
    onAuthStateChanged(auth, user => {
      if (user) {
        setLoggedIn(true);
      }
      setLoadedAuthUI(true);
    });
  });
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar bg="light" expand="lg" variant="dark">
          <Container fluid>
            <Navbar.Brand href="/">
              <img src={logo} alt="CTC Overflow Logo" width="100" />
              CTC Overflow
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="ms-auto">
                <Nav.Link href="/leaderboard" active={leaderboardActive}>
                  Leaderboard
                </Nav.Link>
                <NavDropdown title="Projects" id="basic-nav-dropdown">
                  <NavDropdown.Item href="/view-project/1/">Find Your Anchor</NavDropdown.Item>
                  <NavDropdown.Item href="/view-project/2/">OC Habitats</NavDropdown.Item>
                  <NavDropdown.Item href="/view-project/3/">The Literacy Project</NavDropdown.Item>
                  <NavDropdown.Item href="/view-project/4/">Abound Food Care</NavDropdown.Item>
                </NavDropdown>
                <Nav.Link href="/project-submission" active={projectIdeasActive}>
                  Project Ideas
                </Nav.Link>
                <Nav.Link href="/help" active={helpActive}>
                  Need Help?
                </Nav.Link>
              </Nav>
              {loadedAuthUI && !loggedIn ? (
                <button
                  id="auth-button"
                  className="btn btn-warning"
                  style={{ marginLeft: '0.5rem' }}
                  type="button"
                  onClick={() => {
                    login();
                    setLoggedIn(true);
                  }}
                >
                  Login
                </button>
              ) : (
                <NavDropdown
                  id="user-menu"
                  title={
                    loadedAuthUI && auth.currentUser
                      ? `Hi, ${auth.currentUser.displayName.split(' ')[0]}`
                      : ''
                  }
                >
                  <NavDropdown.Item href="/settings">Settings</NavDropdown.Item>
                  <button
                    type="button"
                    className="btn m-1 p-1"
                    onClick={() => {
                      logout();
                      setLoggedIn(false);
                    }}
                  >
                    Log Out
                  </button>
                </NavDropdown>
              )}
            </Navbar.Collapse>
          </Container>
        </Navbar>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/project-submission" element={<ProjectSubmission />} />
          <Route path="/help" element={<Help />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/post/:id" element={<ViewPost />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
