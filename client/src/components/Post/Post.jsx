import React from 'react';
import PropTypes from 'prop-types';

import './Post.css';

function Post(props) {
  const { date, question, author, description } = props;
  return (
    <div className="Post">
      <div className="row gx-5 align-items-center">
        <div className="col-md-1">
          <p>{date}</p>
        </div>
        <div className="col-md-11">
          <h2>
            <a href="/view-question/1">{question}</a>
          </h2>
          <em>{author}</em>
          <p>{description}</p>
        </div>
      </div>
    </div>
  );
}

Post.propTypes = {
  date: PropTypes.string,
  question: PropTypes.string,
  author: PropTypes.string,
  description: PropTypes.string,
};

Post.defaultProps = {
  date: '',
  question: '',
  author: '',
  description: '',
};

export default Post;
