import React from 'react';
import { Form, Container } from 'react-bootstrap';

function HelpForm() {
  return (
    <div className="HelpForm">
      <Container className="d-grid h-100 mt-5">
        <h2>Help Form</h2>
        <Form>
          <Form.Group className="mb-3" controlId="formName">
            <Form.Label>Name</Form.Label>
            <Form.Control type="text" placeholder="Enter your name" />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formEmail">
            <Form.Label>Email Address</Form.Label>
            <Form.Control type="email" placeholder="Enter your email" />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formProjectName">
            <Form.Label>Question</Form.Label>
            <Form.Control type="text" placeholder="Enter your question" />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formProjectDescription">
            <Form.Label>Description</Form.Label>
            <Form.Control as="textarea" rows={4} placeholder="Please provide a description" />
          </Form.Group>

          <button type="submit" className="btn purple">
            Submit
          </button>
        </Form>
      </Container>
    </div>
  );
}

export default HelpForm;
