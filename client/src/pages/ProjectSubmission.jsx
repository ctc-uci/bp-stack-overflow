import React from 'react';
import { Container } from 'react-bootstrap';
import ProjectForm from '../components/ProjectForm/ProjectForm';

function ProjectSubmission() {
  return (
    <div style={{ minHeight: '70vh' }}>
      <Container className="d-grid h-100 mt-5">
        <h1>Project Ideas Form</h1>
        <p>Have an idea for a project? Let us know!</p>
        <ProjectForm />
      </Container>
    </div>
  );
}

export default ProjectSubmission;
