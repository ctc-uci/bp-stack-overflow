import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import ReactMarkdown from 'react-markdown';
import { BACKEND_URL } from '../Home/Home';
import UserContext from '../../components/UserContext';

import './ViewPost.css';

function ViewPost() {
  // This is the ID for the post that was clicked.
  // We can query the backend to see if the post with the id exists.
  // If it does, we display the details about it on the screen
  //
  const { id } = useParams();
  // # TODO
  // If the post doesn't exist, we should redirect them back to the home page.
  const auth = useContext(UserContext);

  const [loadedPost, setLoadedPost] = useState(false);
  const [postData, setPostData] = useState({});
  const [likedComments, setLikedComments] = useState([]);
  const [commentVotes, setCommentVotes] = useState([]);
  const [isEditingComments, setIsEditingComments] = useState([]);
  const [hasSavedPost, setHasSavedPost] = useState(false);
  const [isEditingPost, setIsEditingPost] = useState(false);
  const [answerText, setAnswerText] = useState('');

  async function grabPost() {
    // Timeout request after 10 seconds.
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      return controller.abort();
    }, 10000);

    let post = await fetch(`${BACKEND_URL}/api/getPost?post_id=${id}`, {
      signal: controller.signal,
    }).catch(_ => {
      return 500;
    });
    post = await post;

    // Update state variables if there is a proper response.
    if (post !== 500) {
      const data = await post.json();
      setPostData(data);
      setLoadedPost(true);
      const likedCommentsArr = [];
      const commentVotesArr = [];
      const isEditingCommentArr = [];
      for (let i = 0; i < data.answers.length; i += 1) {
        if (data.answers[i].voters.includes(auth.currentUser.email)) {
          likedCommentsArr.push(1);
        } else {
          likedCommentsArr.push(0);
        }
        commentVotesArr.push(data.answers[i].voters.length);
        isEditingCommentArr.push(false);
      }
      setLikedComments(likedCommentsArr);
      setCommentVotes(commentVotesArr);
      setIsEditingComments(isEditingCommentArr);
    }
  }

  async function updateSavedState() {
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
    if (savedJSON.includes(id)) {
      setHasSavedPost(true);
    }
  }

  useEffect(() => {
    onAuthStateChanged(auth, user => {
      if (user) {
        grabPost();
        if (loadedPost) {
          updateSavedState();
        }
      }
    });
  }, []);

  function postResponse(e) {
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
    }).then(_ => {
      window.location.reload();
    });
  }

  function editPost(e) {
    e.preventDefault();
    const newPostBody = document.forms['edit-post-form'].elements.f_edited_post.value;
    fetch(`${BACKEND_URL}/api/editPost`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        document_id: id,
        body: newPostBody,
      }),
    }).then(_ => {
      window.location.reload();
    });
  }

  function updateVoterState(postIndex) {
    if (
      postData.answers &&
      !postData.answers[postIndex - 1].voters.includes(auth.currentUser.email)
    ) {
      const newLikedPosts = Array.from(likedComments);
      const newPostVotes = Array.from(commentVotes);
      newLikedPosts[postIndex - 1] = 1;
      newPostVotes[postIndex - 1] += 1;
      setLikedComments(newLikedPosts);
      setCommentVotes(newPostVotes);
    }
  }

  async function likeUnlikeComment(commentIndex) {
    await fetch(`${BACKEND_URL}/api/like`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        uid: auth.currentUser.uid,
        id,
        index: commentIndex,
      }),
    }).then(res => {
      updateVoterState(commentIndex);
    });
    const newPostData = await fetch(`${BACKEND_URL}/api/getPost?post_id=${id}`);
    setPostData(await newPostData.json());
  }

  async function saveUnsavePost(e, shouldSave) {
    const url = `${BACKEND_URL}/api/${shouldSave ? 'savePost' : 'unsavePost'}`;
    await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        uid: auth.currentUser.uid,
        id,
      }),
    });
    setHasSavedPost(shouldSave);
  }

  const editIcon = (
    <button type="button" className="btn btn-none" onClick={_ => setIsEditingPost(true)}>
      <i id="edit" className="bi bi-pencil" />
    </button>
  );

  const editForm = (
    <form id="edit-post-form" onSubmit={editPost}>
      <textarea
        id="f_edited_post"
        name="f_edited_post"
        className="form-control my-3"
        rows="5"
        defaultValue={postData.body}
      />
      <input type="submit" className="btn ctc-btn" value="Edit" />
      <button type="button" className="btn btn-none" onClick={e => setIsEditingPost(false)}>
        Cancel
      </button>
    </form>
  );

  const bookmarkIcon = (
    <button type="button" className="btn btn-none" onClick={e => saveUnsavePost(e, !hasSavedPost)}>
      <i
        id="save"
        className={`bi ${hasSavedPost ? 'bi-bookmark-star-fill' : 'bi-bookmark'}`}
        style={{ color: '#6331d8' }}
      />
    </button>
  );

  return (
    <div className="ViewPost">
      {postData && loadedPost ? (
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-10">
              <h1>{postData.title}</h1>
            </div>
            <div className="col-lg-2 text-end">
              {!isEditingPost && auth.currentUser.email === postData.author ? editIcon : ``}
              {bookmarkIcon}
            </div>
          </div>
          <p>
            <strong>{postData.author}</strong> posted on {postData.date}
          </p>
          {!isEditingPost ? <p>{postData.body}</p> : editForm}
          <hr />
          {postData.answers ? (
            <section className="answer-section">
              <h2 className="mb-5">
                {`${Object.keys(postData.answers).length}
                ${Object.keys(postData.answers).length === 1 ? 'Answer' : 'Answers'}`}
              </h2>
              {postData.answers.map((answerObj, index) => {
                let randKey = '';
                for (let i = 0; i < 16; i += 1) {
                  randKey += Math.floor(Math.random() * 10);
                }
                return (
                  <div key={randKey} className="answer mb-5">
                    <div className="row gx-5 align-items-center">
                      <div className="col-md-1">
                        <button
                          type="button"
                          className="btn btn-none"
                          onClick={e => likeUnlikeComment(index + 1, e)}
                        >
                          <i
                            id="upvote"
                            className={likedComments[index] ? 'bi bi-heart-fill' : 'bi bi-heart'}
                          />
                        </button>
                      </div>
                      <div className="col-md-10">
                        <ReactMarkdown skipHtml>{answerObj.body}</ReactMarkdown>
                        <div className="row">
                          <div className="col-lg-6">
                            <p>
                              <strong>
                                {commentVotes[index]}
                                {commentVotes[index] !== 1 ? ' Votes' : ' Vote'}
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
              <hr />
              <form id="answer-form" onSubmit={postResponse}>
                <div className="my-2">
                  <label className="form-label w-100" htmlFor="f_response">
                    Response
                    <textarea
                      className="form-control"
                      id="f_response"
                      name="f_response"
                      rows="5"
                      onChange={e => setAnswerText(e.target.value)}
                      value={answerText}
                      required
                    />
                  </label>
                  <ReactMarkdown skipHtml>{answerText}</ReactMarkdown>
                </div>
                <input type="submit" className="btn ctc-btn" value="Post Response" />
              </form>
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
