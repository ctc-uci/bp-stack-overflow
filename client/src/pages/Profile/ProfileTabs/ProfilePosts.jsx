import React, { useEffect, useContext } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import UserContext from '../../../components/UserContext';
import { BACKEND_URL } from '../../Home/Home';

function ProfilePosts() {
  const auth = useContext(UserContext);

  function getPosts() {}

  useEffect(() => {
    onAuthStateChanged(auth, user => {
      if (user) {
        getPosts();
      }
    });
  }, []);
  return <div>Posts</div>;
}

export default ProfilePosts;
