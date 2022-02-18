import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Nav, NavDropdown, Navbar, Container } from 'react-bootstrap';
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getAuth, signInWithRedirect, GoogleAuthProvider } from 'firebase/auth';

import Help from './pages/Help';
import Home from './pages/Home/Home';
import Leaderboard from './pages/Leaderboard';
import ProjectSubmission from './pages/ProjectSubmission';
import Profile from './pages/Profile/Profile'
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
  signInWithRedirect(auth, provider);
}

function grab() {
  const req = new XMLHttpRequest();
  const url = '/api/inc';
  req.open('GET', url);
  req.send();
  req.onload = () => {
    document.getElementById('inc').innerHTML = req.responseText;
  };
}

function loadPosts() {
  const req = new XMLHttpRequest();
  const url = '/api/read';
  req.open('GET', url);
  req.send();
  req.onload = () => {
    document.getElementById('posts').innerHTML = req.responseText;
  };
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
                <button
                  onClick={login}
                  type="button"
                  className="btn btn-warning"
                  style={{ marginLeft: '0.5rem' }}
                >
                  Login
                </button>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/project-submission" element={<ProjectSubmission />} />
          <Route path="/help" element={<Help />} />
          <Route path="/profile" element={<Profile/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
