import React, { useContext } from 'react';
import { Form, Container } from 'react-bootstrap';
import { BACKEND_URL } from '../../pages/Home/Home';
import UserContext from '../UserContext';

function HelpForm() {
  const auth = useContext(UserContext);
  async function addQuestion(title, body) {
    await fetch(`${BACKEND_URL}/api/makePost`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        uid: auth.currentUser.uid,
        title,
        body,
      }),
    }).catch(err => {
      addQuestion(title, body);
    });
    alert('Question posted successfully!');
  }
  function submitQuestion(e) {
    e.preventDefault();
    const formElements = document.forms['help-form'].elements;
    const email = formElements.formEmail.value;
    const question = formElements.formQuestion.value;
    const description = formElements.formDescription.value;

    addQuestion(question, description);
  }
  return (
    <div className="HelpForm">
      <Container className="d-grid h-100 mt-5">
        <h2>Help Form</h2>
        <form id="help-form" onSubmit={submitQuestion}>
          <Form.Group className="mb-3" controlId="formName">
            <Form.Label>Name</Form.Label>
            <Form.Control type="text" placeholder="Enter your name" />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formEmail">
            <Form.Label>Email Address</Form.Label>
            <Form.Control type="email" placeholder="Enter your email" />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formQuestion">
            <Form.Label>Question</Form.Label>
            <Form.Control type="text" placeholder="Enter your question" />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formDescription">
            <Form.Label>Description</Form.Label>
            <Form.Control as="textarea" rows={4} placeholder="Please provide a description" />
          </Form.Group>

          <button type="submit" className="btn ctc-btn">
            Submit
          </button>
        </form>
      </Container>
    </div>
  );
}

export default HelpForm;
