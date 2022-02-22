import { PropTypes } from 'prop-types';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { BACKEND_URL } from '../Home/Home';

function ViewPost(props) {
  // This is the ID for the post that was clicked.
  // We can query the backend to see if the post with the id exists.
  // If it does, we display the details about it on the screen
  //
  // # TODO
  // If the post doesn't exist, we should redirect them back to the home page.
  const { email } = props;
  const [postData, setPostData] = useState({});

  const { id } = useParams();
  useEffect(() => {
    fetch(`${BACKEND_URL}/api/getPost?post_id=${id}`).then(res => {
      res.json().then(data => {
        setPostData(data);
      });
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
      body: JSON.stringify(
        `{'author': '${email}', 'body': '${response}', 'parent': '${id}', 'voters': []}`,
      ),
    }).then(res => {
      console.log(res);
      window.location.reload();
    });
  };

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
              <h2 className="mb-3">{Object.keys(postData.answers).length} Answers</h2>
              {postData.answers.map(answerObj => {
                return (
                  <div key={answerObj.author} className="answer mb-3">
                    <p>{answerObj.body}</p>
                    <div className="row">
                      <div className="col-lg-6">
                        <p>
                          <strong>
                            {answerObj.voters.length}
                            {answerObj.voters.length > 1 ? ' Voters' : ' Voter'}
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

ViewPost.propTypes = {
  email: PropTypes.string.isRequired,
};

export default ViewPost;
