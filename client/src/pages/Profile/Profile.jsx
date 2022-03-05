import React from 'react';
import { Container, Button } from 'react-bootstrap';
import './Profile.css';
import ProfileAnswers from './ProfileTabs/ProfileAnswers'
import ProfilePosts from './ProfileTabs/ProfilePosts'
import ProfileProjects from './ProfileTabs/ProfileProjects'
import ProfileSavedPosts from './ProfileTabs/ProfileSavedPosts'
import ProfileSettings from './ProfileTabs/ProfileSettings'

function Profile() {
  const [selectedTab, setSelectedTab] = React.useState('posts');



  return (
    <div>
      <Container fluid className="vh 100">
        <div className="profileBanner">
          <div className="avatarContainer">
            <div className="avatar">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="100%"
                height="100%"
                fill="currentColor"
                className="bi bi-person-circle"
                viewBox="0 0 16 16"
              >
                <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                <path
                  fillRule="evenodd"
                  d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"
                />
              </svg>
            </div>
            <div className="avatarText">
              <text className="avatarName">Username</text>
              <text className="avatarSub">[UCI Email]</text>
              <text className="avatarSub">[xxx] Help Points</text>
            </div>
          </div>

          <button type="button" className="editProfileButton">
            Edit Profile
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="currentColor"
              className="bi bi-pencil-square"
              viewBox="0 0 16 16"
            >
              <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
              <path
                fillRule="evenodd"
                d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"
              />
            </svg>
          </button>z
        </div>

        <div className="tabsContainer">
          <button className={selectedTab==='posts'? 'selectedTab':'tabs'} onClick={()=>setSelectedTab('posts')}>Posts</button>
          <button className={selectedTab==='answers'? 'selectedTab':'tabs'} onClick={()=>setSelectedTab('answers')}>Answers</button>
          <button className={selectedTab==='projects'? 'selectedTab':'tabs'} onClick={()=>setSelectedTab('projects')}>Projects</button>
          <button className={selectedTab==='savedposts'? 'selectedTab':'tabs'} onClick={()=>setSelectedTab('savedposts')}>Saved Posts</button>
          <button className={selectedTab==='settings'? 'selectedTab':'tabs'} onClick={()=>setSelectedTab('settings')}>Settings</button>
        </div>
        <div className="tabsBottom"></div>

        {selectedTab==='posts' &&
        <ProfilePosts></ProfilePosts>
        }
        {selectedTab==='answers' &&
        <ProfileAnswers></ProfileAnswers>
        }
        {selectedTab==='projects' &&
        <ProfileProjects></ProfileProjects>
        }
        {selectedTab==='savedposts' &&
        <ProfileSavedPosts></ProfileSavedPosts>
        }
        {selectedTab==='settings' &&
        <ProfileSettings></ProfileSettings>
        }

      </Container>
    </div>
  );
}

export default Profile;
