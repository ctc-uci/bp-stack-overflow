import React from 'react';

import { Form, Button, Container } from 'react-bootstrap';

function ProjectForm() {
  return (
    <div className="ProjectForm">
      <Container className="d-grid h-100 mt-5">
        <h2>Project Idea Form</h2>
        <Form>
          <Form.Group className="mb-3" controlId="formName">
            <Form.Label>Name</Form.Label>
            <Form.Control type="text" placeholder="Enter name" />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formOrganization">
            <Form.Label>Organization</Form.Label>
            <Form.Control type="text" placeholder="Enter organization" />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formEmail">
            <Form.Label>Email Address</Form.Label>
            <Form.Control type="email" placeholder="Enter email" />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formProjectName">
            <Form.Label>Project Name</Form.Label>
            <Form.Control type="text" placeholder="Enter project name" />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formProjectDescription">
            <Form.Label>Project Description</Form.Label>
            <Form.Control as="textarea" rows={4} placeholder="Enter project description" />
          </Form.Group>

          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
      </Container>
    </div>
  );
}

export default ProjectForm;
