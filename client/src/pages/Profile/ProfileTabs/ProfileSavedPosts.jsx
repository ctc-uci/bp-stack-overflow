import React, { useState, useEffect, useContext } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import UserContext from '../../../components/UserContext';
import { BACKEND_URL } from '../../Home/Home';

function ProfileSavedPosts() {
  const auth = useContext(UserContext);

  const [savedPosts, setSavedPosts] = useState([]);

  function getPosts(postIDArr) {
    postIDArr.forEach(async id => {
      const post = await fetch(`${BACKEND_URL}/api/getPost?post_id=${id}`);
      const postJSON = await post.json();
      setSavedPosts(oldSavedPosts => [...oldSavedPosts, postJSON]);
    });
  }

  async function getSavedIDs() {
    const saved = await fetch(`${BACKEND_URL}/api/getSaved`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        uid: auth.currentUser.uid,
      }),
    });
    const savedJSON = await saved.json();
    getPosts(savedJSON);
  }

  useEffect(() => {
    onAuthStateChanged(auth, user => {
      if (user) {
        getSavedIDs();
      }
    });
  }, []);

  return savedPosts.map(post => {
    let randKey = '';
    for (let i = 0; i < 16; i += 1) {
      randKey += Math.floor(Math.random() * 10);
    }
    return (
      <div key={randKey}>
        <p>{post.body}</p>
      </div>
    );
  });
}

export default ProfileSavedPosts;
