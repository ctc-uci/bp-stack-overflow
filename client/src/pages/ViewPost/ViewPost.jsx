import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';

function ViewPost() {
  // This is the ID for the post that was clicked.
  // We can query the backend to see if the post with the id exists.
  // If it does, we display the details about it on the screen
  //
  // # TODO
  // If the post doesn't exist, we should redirect them back to the home page.
  const { id } = useParams();
  useEffect(() => {
    <p>test</p>;
  });
  return (
    <div className="test">
      <p>test</p>
    </div>
  );
}

export default ViewPost;
