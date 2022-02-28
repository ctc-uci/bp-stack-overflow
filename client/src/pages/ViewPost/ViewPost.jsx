import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { BACKEND_URL } from '../Home/Home';
import UserContext from '../../components/UserContext';

import './ViewPost.css';

function ViewPost() {
  // This is the ID for the post that was clicked.
  // We can query the backend to see if the post with the id exists.
  // If it does, we display the details about it on the screen
  //
  // # TODO
  // If the post doesn't exist, we should redirect them back to the home page.
  const auth = useContext(UserContext);

  const [postData, setPostData] = useState({});
  const [likedPosts, setLikedPosts] = useState([]);
  const [postVotes, setPostVotes] = useState([]);

  const { id } = useParams();
  useEffect(() => {
    onAuthStateChanged(auth, user => {
      console.log(user);
      if (user) {
        fetch(`${BACKEND_URL}/api/getPost?post_id=${id}`).then(res => {
          res.json().then(data => {
            setPostData(data);
            const likedPostsArr = [];
            const postVotesArr = [];
            for (let i = 0; i < data.answers.length; i += 1) {
              if (data.answers[i].voters.includes(auth.currentUser.email)) {
                likedPostsArr.push(1);
              } else {
                likedPostsArr.push(0);
              }
              postVotesArr.push(data.answers[i].voters.length);
            }
            setLikedPosts(likedPostsArr);
            setPostVotes(postVotesArr);
          });
        });
      }
    });
  }, []);

  const postResponse = e => {
    e.preventDefault();
    const response = document.forms['answer-form'].elements.f_response.value;
    fetch(`${BACKEND_URL}/api/makeComment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        uid: auth.currentUser.uid,
        body: response,
        parent: id,
      }),
    }).then(res => {
      window.location.reload();
    });
  };

  function updateVoterState(postIndex) {
    if (
      postData.answers &&
      !postData.answers[postIndex - 1].voters.includes(auth.currentUser.email)
    ) {
      const newLikedPosts = Array.from(likedPosts);
      const newPostVotes = Array.from(postVotes);
      newLikedPosts[postIndex - 1] = 1;
      newPostVotes[postIndex - 1] += 1;
      setLikedPosts(newLikedPosts);
      setPostVotes(newPostVotes);
    }
  }

  async function likeUnlikePost(postIndex) {
    fetch(`${BACKEND_URL}/api/like`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        uid: auth.currentUser.uid,
        id,
        index: postIndex,
      }),
    }).then(res => {
      updateVoterState(postIndex);
    });
    const newPostData = await fetch(`${BACKEND_URL}/api/getPost?post_id=${id}`);
    setPostData(await newPostData.json());
  }

  return (
    <div className="ViewPost">
      {postData ? (
        <div className="container">
          <h1>{postData.title}</h1>
          <p>
            <strong>{postData.author}</strong> posted on {postData.date}
          </p>
          <p>{postData.body}</p>
          <form id="answer-form" onSubmit={postResponse}>
            <div className="my-2">
              <label className="form-label w-100" htmlFor="f_response">
                Response
                <textarea
                  className="form-control"
                  id="f_response"
                  name="f_response"
                  rows="5"
                  required
                />
              </label>
            </div>
            <input type="submit" className="btn purple" value="Post Response" />
          </form>
          <hr />
          {postData.answers ? (
            <section className="answer-section">
              <h2 className="mb-5">{Object.keys(postData.answers).length} Answers</h2>
              {postData.answers.map((answerObj, index) => {
                return (
                  <div key={answerObj.author} className="answer mb-5">
                    <div className="row gx-5 align-items-center">
                      <div className="col-md-1">
                        <button
                          type="button"
                          className="btn btn-none"
                          onClick={e => likeUnlikePost(index + 1, e)}
                        >
                          <i
                            id="upvote"
                            className={likedPosts[index] ? 'bi bi-heart-fill' : 'bi bi-heart'}
                          />
                        </button>
                      </div>
                      <div className="col-md-11">
                        <p className="m-0">{answerObj.body}</p>
                        <div className="row">
                          <div className="col-lg-6">
                            <p>
                              <strong>
                                {postVotes[index]}
                                {postVotes[index] !== 1 ? ' Votes' : ' Vote'}
                              </strong>
                            </p>
                          </div>
                          <div className="col-lg-6">
                            <p style={{ textAlign: 'right' }}>
                              Posted by
                              <strong> {answerObj.author}</strong>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </section>
          ) : (
            <p>Loading answers...</p>
          )}
        </div>
      ) : (
        <div
          className="d-flex justify-content-center vertical-align-middle"
          style={{ color: '#6331d8', minHeight: '80vh' }}
        >
          <div className="spinner-border m-auto" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default ViewPost;
