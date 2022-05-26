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
  //
  // This array is an array of 2-arrays. The first element is the number of votes
  // for that comment and the second is a boolean indicating whether the current
  // user has liked this comment.
  const [commentVotes, setCommentVotes] = useState([]);
  const [commentBeingEdited, setCommentBeingEdited] = useState(null);
  const [hasSavedPost, setHasSavedPost] = useState(false);
  const [isEditingPost, setIsEditingPost] = useState(false);
  const [answerText, setAnswerText] = useState('');

  async function grabPost() {
    // Retrieve the post with the associated id on line 15 (the call to useParams())
    //
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
      // The three arrays keep track of what comments have been liked and
      // the number of votes for each comment.
      if (data.answers) {
        const commentVotesArr = [];
        for (let i = 0; i < data.answers.length; i += 1) {
          const newCommentArr = [data.answers[i].voters.length];
          if (data.answers[i].voters.includes(auth.currentUser.email)) {
            newCommentArr.push(true);
          } else {
            newCommentArr.push(false);
          }
          commentVotesArr.push(newCommentArr);
        }
        setCommentVotes(commentVotesArr);
      }
    }
  }

  async function updateSavedState() {
    // If this post is in the user's list of saved posts, update
    // the state variable showing this so that the correct saved icon
    // will show on the screen.
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
    // Posts the provided response to the database.
    e.preventDefault();
    fetch(`${BACKEND_URL}/api/makeComment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        uid: auth.currentUser.uid,
        body: answerText,
        parent: id,
      }),
    }).then(_ => {
      window.location.reload();
    });
  }

  function editResponse(e) {
    // Edits the comment at index commentBeingEdited
    e.preventDefault();
    fetch(`${BACKEND_URL}/api/editComment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        uid: auth.currentUser.uid,
        body: answerText,
        index: commentBeingEdited,
        document_id: id,
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

  function updateVoterState(commentIndex, action) {
    const newCommentVotes = Array.from(commentVotes);
    if (action === 'like') {
      newCommentVotes[commentIndex][0] += 1;
      newCommentVotes[commentIndex][1] = true;
    } else {
      newCommentVotes[commentIndex][0] -= 1;
      newCommentVotes[commentIndex][1] = false;
    }
    setCommentVotes(newCommentVotes);
  }

  async function likeUnlikeComment(commentIndex) {
    let url;
    let action;
    if (commentVotes[commentIndex][1]) {
      url = `${BACKEND_URL}/api/unlike`;
      action = 'unlike';
    } else {
      url = `${BACKEND_URL}/api/like`;
      action = 'like';
    }
    updateVoterState(commentIndex, action);
    await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        uid: auth.currentUser.uid,
        id,
        index: commentIndex + 1,
      }),
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
                if (!commentVotes[index]) {
                  return <span key={randKey} />;
                }
                return (
                  <div key={randKey} className="mb-5">
                    <div className="row gx-5 align-items-center">
                      <div className="col-md-1">
                        <button
                          type="button"
                          className="btn btn-none"
                          onClick={e => likeUnlikeComment(index, e)}
                        >
                          <i
                            id="upvote"
                            className={commentVotes[index][1] ? 'bi bi-heart-fill' : 'bi bi-heart'}
                          />
                        </button>
                        {answerObj.author === auth.currentUser.email ? (
                          <button
                            type="button"
                            className="btn btn-none"
                            onClick={_ => {
                              setCommentBeingEdited(index);
                              setAnswerText(answerObj.body);
                              document.getElementById('f_response').focus();
                            }}
                          >
                            <i id="editComment" className="bi bi-pencil" />
                          </button>
                        ) : null}
                      </div>
                      <div className="col-md-10">
                        <ReactMarkdown skipHtml>{answerObj.body}</ReactMarkdown>
                        <div className="row">
                          <div className="col-lg-6">
                            <p>
                              <strong>
                                {commentVotes[index][0]}
                                {commentVotes[index][0] !== 1 ? ' Votes' : ' Vote'}
                              </strong>
                            </p>
                          </div>
                          <div className="col-lg-6 text-end">
                            <p>
                              Posted by
                              <strong> {answerObj.author}</strong>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <hr style={{ width: '97.5%', margin: '2rem auto' }} />
                  </div>
                );
              })}
              <form
                id="answer-form"
                onSubmit={commentBeingEdited !== null ? editResponse : postResponse}
              >
                <div className="my-2">
                  <label className="form-label w-100" htmlFor="f_response">
                    Response
                    <textarea
                      className="form-control"
                      id="f_response"
                      name="f_response"
                      rows="10"
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
