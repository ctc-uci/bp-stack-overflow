import React, { useState, useEffect, useContext } from 'react';
import { Container, Tab, Tabs } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import './Profile.css';
import ProfileAnswers from './ProfileTabs/ProfileAnswers';
import ProfilePosts from './ProfileTabs/ProfilePosts';
import ProfileProjects from './ProfileTabs/ProfileProjects';
import ProfileSavedPosts from './ProfileTabs/ProfileSavedPosts';
import ProfileSettings from './ProfileTabs/ProfileSettings';
import UserContext from '../../components/UserContext';
import { BACKEND_URL } from '../Home/Home';

function Profile() {
  const auth = useContext(UserContext);
  const { tab } = useParams();

  const [selectedTab, setSelectedTab] = useState('');
  const [points, setPoints] = useState(0);
  const [photoURL, setPhotoURL] = useState('');

  async function getPoints() {
    const leaderboard = await fetch(`${BACKEND_URL}/api/leaderboard`);
    const data = (await leaderboard.json()).result;
    const user = data.filter(val => val.id === auth.currentUser.email)[0];
    setPoints(user.points);
    setPhotoURL(user.photo_url);
  }

  useEffect(() => {
    onAuthStateChanged(auth, user => {
      if (user) {
        switch (tab) {
          case 'posts':
            setSelectedTab('posts');
            break;
          case 'answers':
            setSelectedTab('answers');
            break;
          case 'projects':
            setSelectedTab('projects');
            break;
          case 'saved':
            setSelectedTab('saved');
            break;
          case 'settings':
            setSelectedTab('settings');
            break;
          default:
            setSelectedTab('posts');
            break;
        }
        getPoints();
      } else {
        useNavigate('/');
      }
    });
  }, []);
  return (
    <div style={{ minHeight: '70vh' }}>
      <Container>
        <div className="profileBanner">
          <div className="avatarContainer">
            <div className="avatar">
              <img
                src={photoURL}
                style={{ width: '100%' }}
                alt={`Profile for ${auth.currentUser ? auth.currentUser.displayName : ''}`}
              />
            </div>
            <div className="avatarText">
              <h1 className="avatarName">{auth.currentUser ? auth.currentUser.displayName : ''}</h1>
              <p>{auth.currentUser ? auth.currentUser.email : ''}</p>
              <p>{points} Help Points</p>
            </div>
          </div>
        </div>
        <Tabs
          activeKey={selectedTab}
          id="uncontrolled-tab-example"
          className="mb-3"
          onSelect={(eventKey, e) => {
            window.location.href = `/profile/${eventKey}`;
          }}
        >
          <Tab eventKey="posts" title="Posts">
            <ProfilePosts />
          </Tab>
          <Tab eventKey="answers" title="Answers">
            <ProfileAnswers />
          </Tab>
          <Tab eventKey="projects" title="Projects">
            <ProfileProjects />
          </Tab>
          <Tab eventKey="saved" title="Saved Posts">
            <ProfileSavedPosts />
          </Tab>
          <Tab eventKey="settings" title="Settings">
            <ProfileSettings />
          </Tab>
        </Tabs>
      </Container>
    </div>
  );
}

export default Profile;
